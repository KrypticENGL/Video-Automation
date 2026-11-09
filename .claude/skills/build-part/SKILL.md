---
name: build-part
description: Workflow for starting or finishing any build part (Part 1–7). Use at the start of a part to plan it and at the end to verify, review, update PROGRESS.md and commit.
---

# Build-part workflow

Start:
1. Read CLAUDE.md, SPEC.md, PROGRESS.md.
2. Restate the part's goal and "done when" in 2–3 lines.
3. Give a plan: files to create/change, packages, env vars, anything needed from the user. Wait for OK if the part prompt asks for it, or if you need anything from the user.

Finish:
1. Typecheck, lint and tests all pass (show the commands and results): `npm run typecheck && npm run lint && npm test` in both /server and /app.
2. Run the security-checklist skill, then ask the reviewer subagent to review the diff; fix what it finds or explain why not.
3. Update PROGRESS.md: what was built, how to run it, a manual test checklist for the user, known issues, next part.
4. One git commit: "part N: <summary>".
