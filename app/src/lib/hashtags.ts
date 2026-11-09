export const MAX_HASHTAGS = 5;

/** "#Study Abroad!" → "studyabroad". Letters, digits and underscores only (any script). */
export const normaliseHashtag = (raw: string) =>
  raw
    .replace(/[^\p{L}\p{N}_]/gu, '')
    .toLowerCase()
    .slice(0, 50);

/** Returns a new list with the tag added, or the same list if it's empty, a duplicate or over the limit. */
export function addHashtag(list: readonly string[], raw: string, max = MAX_HASHTAGS): string[] {
  const tag = normaliseHashtag(raw);
  if (!tag || list.includes(tag) || list.length >= max) return [...list];
  return [...list, tag];
}
