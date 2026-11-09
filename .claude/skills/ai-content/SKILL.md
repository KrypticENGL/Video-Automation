---
name: ai-content
description: Use when writing or changing Gemini prompts for captions, hashtags or reel scripts.
---

# AI content rules (EdFinco — education loans / study abroad)

- Always pass the BrandBrief (tone, audience, CTA, topics to avoid, default hashtags) into the prompt.
- Ask for structured JSON with a schema (responseSchema) and validate it with Zod; retry once on invalid output.
- Captions: a hook in the first line (under ~125 characters, so it shows before "more"), 2–4 short lines of value, a clear CTA, simple English, at most 1–2 emojis.
- Hashtags: 3–5, relevant and specific (mix of niche and medium-reach), no banned or spammy tags, no duplicates.
- Finance compliance: never promise loan approval, never invent interest rates, amounts, bank names or eligibility rules; no "guaranteed". If the source video or topic states figures, keep them exactly and add them to onScreenClaimsToCheck so the user can verify them.
- Scripts: hook in the first 2 seconds, one idea per shot, voiceover ≤ ~65 words for 24 s, ends with the CTA.
- Keep all prompts in /server/src/prompts/*.ts as versioned template functions, never inline in handlers.
