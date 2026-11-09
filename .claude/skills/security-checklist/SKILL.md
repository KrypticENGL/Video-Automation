---
name: security-checklist
description: Project security review checklist. Use before finishing any build part, before asking the reviewer subagent.
---

# Security review checklist

Go through every item against the part's diff and report pass / fail / not applicable for each.

- Every route except /auth/login, /health and /instagram/callback requires a valid JWT; resource ownership checked (userId). /instagram/callback verifies a signed `state`.
- Zod validation on all inputs; body size limits; rate limit on login.
- Presigned URLs: 15-minute expiry, content-type and size limits, keys namespaced per user.
- No secrets, tokens or full captions with personal data in logs. .env is gitignored; .env.example has no real values.
- Tokens encrypted at rest. JWT secret length ≥ 32 bytes.
- Child processes: no shell interpolation; args arrays only; temp files cleaned.
- Jobs are idempotent; no double publishing on retry.
- Dependencies: run `npm audit` in /server and /app and report high/critical issues.
