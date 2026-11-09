# Instagram Reels Automation — Project Spec

Android app + backend that lets a single client (an education-loan brand, EdFinco) post Instagram Reels in two ways:

1. **Own video** — client picks a video from the phone; AI writes the caption and hashtags; client approves; it posts to Instagram.
2. **From a topic** — client types a topic; AI writes a script, generates the video with Kling 3.0 Turbo, edits it into a reel, writes caption and hashtags; client approves; it posts.

Nothing is ever published without the client tapping **Approve & Post**.

---

## 1. Architecture

```
Android app (Expo / React Native)
   │  HTTPS + JWT
   ▼
Backend API (Node.js + Express)  ──►  MongoDB (users, posts, jobs, tokens)
   │
   ├── Job worker (Agenda, MongoDB-backed queue)
   │      ├── Gemini API   – video understanding, scripts, captions, hashtags, TTS voiceover
   │      ├── Kling 3.0 Turbo (via API provider) – text-to-video clips
   │      └── ffmpeg       – stitch clips, voiceover, burned-in captions, logo, end card
   ├── Cloudflare R2 (S3-compatible) – video storage, public URLs for Instagram
   ├── Instagram API with Instagram Login – publish Reels
   └── Expo Push Notifications – "your reel is ready to review"
```

**Rules**
- The app never holds third-party API keys. All keys live on the backend in env vars.
- Videos upload from the phone **directly to R2** via presigned PUT URLs from the backend (no large files through Express).
- Long work (Gemini analysis, Kling generation, ffmpeg) runs in the worker, never in a request handler.
- The video generation provider sits behind a `VideoProvider` interface so Kling can be swapped for Veo 3.1 Fast or another model by changing config.

---

## 2. Tech stack

| Layer | Choice |
|---|---|
| Mobile | Expo (React Native, TypeScript), Expo Router, expo-image-picker, expo-video, expo-notifications, expo-secure-store |
| Backend | Node.js 20+, Express, TypeScript, Zod for validation |
| DB / queue | MongoDB (Mongoose), Agenda for jobs |
| Storage | Cloudflare R2 via `@aws-sdk/client-s3` + `@aws-sdk/s3-request-presigner` |
| AI text / vision / TTS | Google Gemini API via `@google/genai` (use the current Flash model for analysis and writing; Gemini TTS for voiceover) |
| AI video | Kling 3.0 Turbo through an API provider (official Kling API or an aggregator — decide in Phase 2, check its docs) |
| Video editing | ffmpeg binary on the server, called via `child_process.spawn` (do not use fluent-ffmpeg) |
| Hosting | Single small Linux VPS with Docker Compose (api, worker, mongo); Caddy for HTTPS |

---

## 3. Data model (MongoDB)

- **User**: `email`, `passwordHash`, `expoPushToken`, `createdAt`. (One client user, plus an admin.)
- **InstagramAccount**: `userId`, `igUserId`, `username`, `accessToken` (encrypted at rest), `tokenExpiresAt`.
- **BrandBrief**: `userId`, `brandName`, `tone`, `audience`, `cta`, `topicsToAvoid[]`, `defaultHashtags[]`, `logoKey`, `colors[]`, `voice` (TTS voice name).
- **Post**:
  - `userId`, `mode` (`own_video` | `from_topic`)
  - `status`: `uploading` → `processing` → `ready_for_review` → `publishing` → `published` | `failed` | `discarded`
  - `topic` (mode 2), `script` (mode 2: `{ hook, shots: [{ voiceover, prompt, durationSec }], cta }`)
  - `sourceVideoKey`, `finalVideoKey`, `finalVideoUrl`, `thumbnailKey`
  - `caption`, `hashtags[]`
  - `igContainerId`, `igMediaId`, `permalink`
  - `costEstimateInr`, `error`, timestamps
- **Job log** (Agenda's own collection), plus a `provider_calls` collection that records every Kling or Gemini call with its cost for monthly reporting.

---

## 4. Backend API

All routes except auth require `Authorization: Bearer <jwt>`.

```
POST   /auth/login                       → { token }
POST   /devices/push-token               { expoPushToken }

GET    /brand-brief                      / PUT /brand-brief

GET    /instagram/connect-url            → OAuth URL (opened in an in-app browser)
GET    /instagram/callback               OAuth redirect; exchange code → long-lived token
GET    /instagram/status                 → { connected, username, tokenExpiresAt }

POST   /uploads/presign                  { contentType, sizeBytes } → { key, putUrl }

POST   /posts/own-video                  { sourceVideoKey } → Post (queues analyse_and_caption)
POST   /posts/from-topic                 { topic, quality: "hook" | "full" } → Post (queues generate_reel)
GET    /posts                            list, newest first
GET    /posts/:id                        detail incl. signed preview URL
PATCH  /posts/:id                        { caption?, hashtags? }  (client edits)
POST   /posts/:id/regenerate-caption     { instruction? }
POST   /posts/:id/regenerate-shot        { shotIndex }            (mode 2 only)
POST   /posts/:id/approve                → queues publish_to_instagram
POST   /posts/:id/discard
GET    /usage                            this month's spend by provider
```

---

## 5. Pipelines (worker jobs)

### Mode 1 – `analyse_and_caption`
1. Validate the uploaded video with ffprobe: duration, codec, aspect ratio. If needed, transcode to H.264/AAC MP4, 9:16, 30 fps (check Instagram's current Reels specs in Meta's docs).
2. Upload the video to the Gemini Files API, wait until it is ACTIVE, then ask the Flash model, with the BrandBrief as context, to return JSON with `{ summary, caption, hashtags[3-5], onScreenClaimsToCheck[] }`.
3. Save the result, set status to `ready_for_review`, and send a push notification.

### Mode 2 – `generate_reel`
1. **Script.** Gemini writes structured JSON: a hook, then 2–3 shots (the total stays within ~24 s; each Kling clip must be 3–15 s), voiceover lines, a Kling prompt per shot, and the CTA. Prompts must request vertical 9:16, a realistic handheld-phone look, natural light and Indian settings, with **no on-screen text**. People appear as B-roll, never talking to camera.
2. **Video.** For each shot, call `VideoProvider.generate({ prompt, durationSec, aspectRatio: "9:16", resolution: "720p" })` and poll until it finishes. Generate shots in parallel. Log cost per call.
3. **Voiceover.** Gemini TTS produces narration from the voiceover lines, using the brand voice.
4. **Edit (ffmpeg).** Concatenate the clips, mix the voiceover over the clip audio (duck the clip audio to about 20%), burn in captions, overlay the logo, append a 2 s branded end card, and output 1080×1920 H.264/AAC MP4. All numbers and claims on screen come from the script text, never from AI-generated imagery.
5. **Caption.** Gemini writes the caption and 3–5 hashtags.
6. Upload to R2, set status to `ready_for_review`, and send a push notification.

`quality: "hook"` → only shot 1 is AI-generated. The remaining shots use a static branded background with animated captions (Phase 2b: stock footage).

### `publish_to_instagram`
1. Make sure `finalVideoUrl` is publicly reachable on R2.
2. `POST https://graph.instagram.com/<API_VERSION>/<IG_USER_ID>/media` with `media_type=REELS`, `video_url`, `caption` (caption + hashtags), then save `igContainerId`.
3. Poll the container's `status_code` until it is `FINISHED` (with backoff and a timeout). On `ERROR`, fail with the message.
4. `POST .../<IG_USER_ID>/media_publish` with `creation_id`, then fetch the `permalink` and set status to `published`.
5. Check `content_publishing_limit` before publishing. The limit is 100 posts per 24 h.

### `refresh_instagram_token` (daily cron)
Refresh long-lived tokens that expire within 10 days, using the `refresh_access_token` endpoint.

---

## 6. Android app screens

1. **Login**: email and password; the JWT is stored in expo-secure-store.
2. **Home**: two large buttons, **Post my video** and **Create from topic**, plus a list of recent posts with status chips.
3. **Post my video**: pick from the gallery, preview it, then **Generate caption**. The upload shows a progress bar and goes to the presigned URL.
4. **Create from topic**: a topic text box, a quality toggle (Hook only ≈ ₹120 / Full AI ≈ ₹360) that shows the estimated cost, then **Create reel**.
5. **Processing**: shows the status and can be left; a push notification arrives when the reel is ready.
6. **Review**: video player, an editable caption, editable hashtag chips, **Regenerate caption** (with an optional instruction), **Redo shot N** (mode 2), **Approve & Post**, and **Discard**.
7. **Published**: a success message with **Open in Instagram** (permalink).
8. **Settings**: Instagram connection status with a Connect/Reconnect button, a brand brief editor, this month's AI spend, and logout.

UI language is English. Keep it simple, with large touch targets. The client is not technical.

---

## 7. Environment variables (backend)

```
MONGO_URI, JWT_SECRET, TOKEN_ENCRYPTION_KEY
PUBLIC_BASE_URL
R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET, R2_PUBLIC_BASE_URL
GEMINI_API_KEY
VIDEO_PROVIDER=kling, KLING_API_BASE, KLING_API_KEY (+ secret if the provider uses signed JWTs)
IG_APP_ID, IG_APP_SECRET, IG_REDIRECT_URI, IG_API_VERSION
EXPO_ACCESS_TOKEN (optional)
```

---

## 8. Security and reliability

- Validate every request with Zod and rate-limit `/auth/login`.
- Encrypt Instagram tokens at rest (AES-256-GCM using `TOKEN_ENCRYPTION_KEY`).
- Presigned URLs expire in 15 minutes and are limited by content type and size (max 500 MB).
- Retry jobs with exponential backoff. Kling and Instagram calls must be idempotent, so a retry never publishes twice: check `igMediaId` before publishing.
- Add a per-month spend cap (env `MONTHLY_AI_BUDGET_INR`). Mode 2 refuses new jobs once the cap is reached and shows a clear message.
- Never log tokens or API keys.

---

## 9. Build phases (do them in order; each ends with a working demo)

**Phase 0 – Skeleton**
Monorepo with `/app` (Expo) and `/server` (Express + worker) and a docker-compose file for local Mongo. Login works end to end. The app builds as a development APK with EAS.

**Phase 1 – Mode 1 (own video)**
Presigned upload, `analyse_and_caption`, the Review screen, the Instagram OAuth connect flow, `publish_to_instagram`, and push notifications.
✅ Done when: a video picked on the phone is live on the test Instagram account with an AI caption, after tapping Approve.

**Phase 2 – Mode 2 (from topic)**
Script generation, the `VideoProvider` interface with a Kling implementation, TTS, the ffmpeg edit, the quality toggle, Redo shot, and cost logging and caps.
✅ Done when: typing "3 documents you need for an education loan" produces a reviewed, branded 24 s reel that publishes.

**Phase 3 – Polish and deploy**
Settings and brand brief editor, usage screen, deployment to a VPS with Caddy HTTPS, a production APK through EAS, and a one-page setup guide for the client.

---

## 10. Things to verify in official docs before coding (do not guess)

- Instagram API with Instagram Login: current API version, OAuth scopes needed to publish (`instagram_business_basic`, `instagram_business_content_publish`), Reels video specs, container status polling.
- Kling 3.0 Turbo through the chosen provider: auth method, endpoint, durations (3–15 s), aspect ratio param, audio flag, polling or webhook, price per second.
- Gemini: current Flash model ID, the Files API flow for video, and TTS model and voice names.
- Expo: the current SDK version, EAS Build for Android APK/AAB, and notifications setup (needs FCM credentials).
