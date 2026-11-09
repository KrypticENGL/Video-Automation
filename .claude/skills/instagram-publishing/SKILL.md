---
name: instagram-publishing
description: Use for anything touching Instagram OAuth, access tokens, token refresh or publishing Reels.
---

# Instagram publishing

- Use "Instagram API with Instagram Login" (graph.instagram.com). Confirm the API version and scopes in the docs (expected: instagram_business_basic, instagram_business_content_publish).
- OAuth: code → short-lived token → long-lived token (~60 days). Store tokens encrypted (AES-256-GCM). A daily job refreshes tokens expiring within 10 days.
- /instagram/callback is a browser redirect and carries no JWT: bind it to the user with a signed, short-lived `state` parameter and verify it before exchanging the code.
- Publish a Reel: create container (media_type=REELS, video_url reachable by Meta, caption) → poll status_code with backoff until FINISHED (timeout ~10 min; ERROR = fail with message) → media_publish(creation_id) → fetch permalink.
- Idempotency: store igContainerId/igMediaId on the Post; never call media_publish if igMediaId exists. Use a job lock per post.
- Check content_publishing_limit before publishing (read the current limit from the docs/API, don't hardcode it).
- Video must meet Meta's current Reels specs (check docs); transcode if not.
- Caption = caption text + blank line + hashtags. Respect Instagram's caption and hashtag limits from the docs.
