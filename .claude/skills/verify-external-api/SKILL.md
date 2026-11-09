---
name: verify-external-api
description: Use before writing or changing any code that calls a third-party API or SDK (Instagram, Gemini, Kling provider, Cloudflare R2, Expo push). Read the current official docs first and record what you learned.
---

# Verify external APIs

- Never rely on memory for endpoints, params, scopes, model IDs, limits, prices or SDK versions. Read the current official docs first.
- Save what you learned in docs/api-notes/<service>.md: doc URLs, date checked, endpoints, params, limits, auth, error codes, gotchas.
- Put the doc URL in a comment above the integration code.
- Wrap each service in a small client module (/server/src/integrations/<service>.ts) with typed inputs/outputs, timeouts, retries with backoff, and errors normalised to one AppError type (/server/src/lib/AppError.ts).
- In tests, mock the client module, never the network layer inside it.
