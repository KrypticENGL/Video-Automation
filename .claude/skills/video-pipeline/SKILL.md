---
name: video-pipeline
description: Use for Kling / VideoProvider work, TTS voiceover, ffmpeg editing, or any Mode 2 (from topic) media work.
---

# Video pipeline (Mode 2)

- All video generation goes through the VideoProvider interface (generate, getStatus, download, estimateCost). Kling 3.0 Turbo is the default implementation; the provider is chosen by the VIDEO_PROVIDER env var.
- Defaults: 720p, 9:16, clips 3–15 s (check the provider docs), total reel ~24 s. Generate shots in parallel.
- Prompt style for every shot: realistic, handheld phone-camera look, natural light, everyday Indian settings, people as B-roll (never talking to camera), NO text/letters/numbers/logos in the frame. Avoid the words "cinematic", "epic", "4K".
- Log every provider call to provider_calls with seconds generated and cost in INR. Enforce MONTHLY_AI_BUDGET_INR before starting a job.
- ffmpeg: spawn the binary directly, build args as arrays (never shell strings), log stderr on failure, write to a temp dir and clean up. Output 1080x1920, 30 fps, H.264 high, AAC 128k, +faststart.
- Edit order: normalise clips → concat → voiceover mix (duck clip audio to ~20%) → burned-in captions (ASS subtitles, brand font, safe margins away from Instagram UI) → logo overlay (top-right, 70% opacity) → 2 s end card.
- All on-screen numbers and claims come from the script text, never from generated imagery.
- Keep ffmpeg command builders as pure functions with unit tests; one integration test runs on tiny sample clips in /server/test/fixtures.
