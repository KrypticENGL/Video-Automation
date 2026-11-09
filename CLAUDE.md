# Project rules

- SPEC.md = what to build. PROGRESS.md = what's done. Read both at the start of every task.
- Build only the part I ask for. No features beyond SPEC.md. If SPEC.md is wrong or unclear, say so and propose an edit; never silently diverge.
- Use the project skills in .claude/skills. They are mandatory for their areas:
  - any UI work → mobile-ui
  - starting/finishing any part → build-part
  - any third-party API → verify-external-api
  - Instagram → instagram-publishing
  - Kling / ffmpeg / TTS → video-pipeline
  - Gemini prompts for captions/scripts → ai-content
  - before closing a part → security-checklist, then the reviewer subagent
- Stack: /app = Expo + TypeScript + Expo Router + NativeWind. /server = Node 20+ + Express + TypeScript, Mongoose, Agenda, Zod, Vitest. ffmpeg via child_process.spawn.
- Secrets live only in /server/.env (gitignored). Keep .env.example current. The app never holds API keys.
- Strict TypeScript everywhere. No `any` without a comment explaining why.
- Every part ends with: typecheck + lint + tests passing, PROGRESS.md updated, one git commit.
- If you need an API key, account or decision from me: stop and ask. Never fake it with something that looks finished.

<!-- code-review-graph MCP tools -->
## MCP Tools: code-review-graph

**IMPORTANT: This project has a knowledge graph. ALWAYS use the
code-review-graph MCP tools BEFORE using Grep/Glob/Read to explore
the codebase.** The graph is faster, cheaper (fewer tokens), and gives
you structural context (callers, dependents, test coverage) that file
scanning cannot.

### When to use graph tools FIRST

- **Exploring code**: `semantic_search_nodes` or `query_graph` instead of Grep
- **Understanding impact**: `get_impact_radius` instead of manually tracing imports
- **Code review**: `detect_changes` + `get_review_context` instead of reading entire files
- **Finding relationships**: `query_graph` with callers_of/callees_of/imports_of/tests_for
- **Architecture questions**: `get_architecture_overview` + `list_communities`

Fall back to Grep/Glob/Read **only** when the graph doesn't cover what you need.

### Key Tools

| Tool | Use when |
|------|----------|
| `detect_changes` | Reviewing code changes — gives risk-scored analysis |
| `get_review_context` | Need source snippets for review — token-efficient |
| `get_impact_radius` | Understanding blast radius of a change |
| `get_affected_flows` | Finding which execution paths are impacted |
| `query_graph` | Tracing callers, callees, imports, tests, dependencies |
| `semantic_search_nodes` | Finding functions/classes by name or keyword |
| `get_architecture_overview` | Understanding high-level codebase structure |
| `refactor_tool` | Planning renames, finding dead code |

### Workflow

1. The graph auto-updates on file changes (via hooks).
2. Use `detect_changes` for code review.
3. Use `get_affected_flows` to understand impact.
4. Use `query_graph` pattern="tests_for" to check coverage.
