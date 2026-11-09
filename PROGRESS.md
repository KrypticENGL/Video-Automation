# Progress

## Status

**Part 1 is built and checked on the PC. Login on a real phone is not tested yet** (needs your `.env` and a MongoDB; see the manual checklist).

Next: Part 2 (upload a video and get an AI caption). Needed before it starts: Cloudflare R2 keys and a Gemini API key.

## Parts

- [x] **Part 1 — Skeleton and login** (SPEC Phase 0). Project rules, skills, reviewer subagent, permissions, design system, server and app skeleton, login.
- [ ] **Part 2 — Upload a video and get an AI caption** (Mode 1 up to the Review screen, no posting)
- [ ] **Part 3 — Connect Instagram and publish**
- [ ] **Part 4 — Push notifications and Mode 1 polish** (includes the EAS development APK)
- [ ] **Part 5 — Mode 2: script and Kling clips**
- [ ] **Part 6 — Mode 2: voiceover, editing and full flow**
- [ ] **Part 7 — Settings, usage, deployment**

## What Part 1 built

- **Rules and tooling:** `CLAUDE.md`, 7 skills in `.claude/skills/`, `.claude/agents/reviewer.md`, permissions in `.claude/settings.json`, `docs/api-notes/`.
- **Server (`/server`):** Express 5 + TypeScript. `src/api.ts` and `src/worker.ts` entry points. Env validated at startup (`src/config`). `POST /auth/login` (bcrypt, JWT valid 30 days, 10 attempts per 15 minutes), `GET /me`, `GET /health`. Every route except `/auth/login` and `/health` needs a JWT. Agenda worker with a `healthcheck` demo job every minute. Seed script for the client user.
- **App (`/app`):** Expo SDK 58, Expo Router, NativeWind. Design tokens in `src/theme/tokens.ts`, 26 components in `src/components/ui`, and the `/dev/gallery` screen. Screens: Login, Home, Settings. The JWT is kept in expo-secure-store; an expired token sends you back to Login.

## How to run

**One-time setup**

1. MongoDB, either:
   - Docker Desktop (`winget install Docker.DockerDesktop`), then `docker compose up -d` in the repo root, or
   - a free MongoDB Atlas cluster: use its connection string as `MONGO_URI`.
2. In `server/`: copy `.env.example` to `.env` and fill in `JWT_SECRET` (the file shows how to generate one), `SEED_USER_EMAIL` and `SEED_USER_PASSWORD` (10+ characters).
3. `cd server && npm install && npm run seed` (creates the login; run it again any time to reset the password).
4. `cd app && npm install`.
5. Let the phone reach the PC. In an **administrator** PowerShell:
   `New-NetFirewallRule -DisplayName "Reels dev" -Direction Inbound -Protocol TCP -LocalPort 4000,8081 -Action Allow -Profile Private`
6. Install **Expo Go** on the Android phone (it must support SDK 58; update it from the Play Store).

**Every time**

| Terminal | Command |
|---|---|
| 1 | `cd server && npm run dev:api` |
| 2 | `cd server && npm run dev:worker` |
| 3 | `cd app && npx expo start` then scan the QR code with Expo Go |

The phone and the PC must be on the same Wi-Fi. The app finds the API by itself in development (same address as the Expo dev server, port 4000).

**Checks:** `npm run typecheck`, `npm run lint`, `npm test` in both `server/` and `app/`.

**Expo Go or a dev build?** Expo Go is enough for Parts 1–3, because every native module used so far ships inside it. Push notifications (Part 4) do not work in Expo Go on Android, so Part 4 moves to an EAS development build.

## Manual test checklist (Part 1)

- [ ] `npm run dev:api` logs "api listening"; `http://localhost:4000/health` shows `{"ok":true}`.
- [ ] `npm run dev:worker` logs "healthcheck job ran" about once a minute.
- [ ] App opens on the phone and shows the Login screen with the gradient header.
- [ ] Tapping **Log in** with empty fields shows "Enter your email address" and "Enter your password".
- [ ] A wrong password shows "Wrong email or password." and the phone gives an error buzz.
- [ ] The right email and password open Home.
- [ ] Both action cards open a "Coming soon" sheet. The sheet closes with **Got it**, a swipe down, a tap outside, and the Android back button.
- [ ] The gear icon opens Settings. It shows your email, and Instagram as "Not connected".
- [ ] Close and reopen the app: still logged in.
- [ ] **Log out** asks for confirmation, then returns to Login. Reopening the app stays on Login.
- [ ] Switch the phone between light and dark mode: every screen follows.
- [ ] Settings → Component gallery: scroll through; play the sample video; open both sheets; the sun/moon button switches theme.
- [ ] The keyboard does not cover the password field or the Log in button.

## What was verified on the PC

- Typecheck, lint and tests pass: server 15 tests, app 6 tests.
- Server run for real against a throwaway in-memory MongoDB: seed, login, wrong password, `/me`, missing token, malformed JSON, and the worker's healthcheck job all behave as expected.
- App: the Android bundle compiles. Login, Home, Settings and the full gallery were screenshotted in Expo web at 412×915 in light and dark mode and reviewed.
- **Not verified:** anything on a real Android device (fonts, haptics, bottom sheets, keyboard handling, secure storage, video playback).

## Known issues and open decisions

1. **SPEC.md edits proposed, waiting for your OK** (the code does not depend on them yet):
   - `/instagram/callback` cannot carry a JWT (it is a browser redirect from Meta). It needs a signed, short-lived `state` parameter. The `instagram-publishing` skill already says so.
   - Keep the R2 bucket private and give Instagram a presigned GET URL, instead of a public bucket that also exposes the client's raw uploads. To be confirmed against Meta's docs in Part 3.
   - "Node 20+": Node 20 is past end of life. Suggest 22+.
   - Phase 0 says the app "builds as a development APK with EAS". Moved to Part 4, where it is first needed.
   - "100 posts per 24 h" and the 500 MB upload cap are to be checked against Meta's docs in Part 3, not trusted from the spec.
2. The skill is named `security-checklist`, not `security-review`, because Claude Code already has a built-in `/security-review` command.
3. The `reviewer` subagent file was created mid-session; restart Claude Code once so it loads.
4. Permissions: `npm`/`npx`/`node` are allowed in any folder (rules cannot be limited to `/app` and `/server`). `rm -rf` is denied for paths starting with `/`, `~`, `..` or a drive letter.
5. The login rate limit is in memory and per IP. Behind Caddy (Part 7) the server needs `trust proxy` set, or every user shares one limit.
6. No refresh tokens: the JWT lasts 30 days, then the app asks for the password again.
7. Brand colours, app icon and splash image are placeholders until the client's brand brief arrives.
8. `npm audit`: no high or critical issues. Moderate ones are all in dev tooling (ESLint's dependencies).
9. This PC runs Node 25, which is not an LTS release; some tools print engine warnings. Node 24 LTS is the safer choice.
