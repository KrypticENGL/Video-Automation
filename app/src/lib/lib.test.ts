import { describe, expect, it } from 'vitest';
import { toApiError } from './apiError';
import { formatInr } from './format';
import { addHashtag, normaliseHashtag } from './hashtags';

describe('formatInr', () => {
  it('uses Indian digit grouping', () => {
    expect(formatInr(360)).toBe('₹360');
    expect(formatInr(125000)).toBe('₹1,25,000');
  });
});

describe('hashtags', () => {
  it('normalises', () => {
    expect(normaliseHashtag('#Study Abroad!')).toBe('studyabroad');
  });
  it('ignores empty, duplicate and over-limit tags', () => {
    expect(addHashtag(['loans'], '  # ')).toEqual(['loans']);
    expect(addHashtag(['loans'], '#Loans')).toEqual(['loans']);
    expect(addHashtag(['a', 'b', 'c', 'd', 'e'], 'f')).toHaveLength(5);
    expect(addHashtag(['loans'], 'visa')).toEqual(['loans', 'visa']);
  });
});

describe('toApiError', () => {
  it('shows the server message for 4xx', () => {
    const e = toApiError(401, {
      error: { code: 'invalid_credentials', message: 'Wrong email or password.' },
    });
    expect(e).toMatchObject({
      status: 401,
      code: 'invalid_credentials',
      message: 'Wrong email or password.',
    });
  });
  it('hides developer-facing messages', () => {
    expect(toApiError(500, { error: { code: 'internal', message: 'stack trace' } }).message).toBe(
      'Something went wrong. Please try again.',
    );
    expect(
      toApiError(400, { error: { code: 'invalid_input', message: 'email: bad' } }).message,
    ).toBe('Something went wrong. Please try again.');
  });
  it('copes with a non-JSON body', () => {
    expect(toApiError(429, null).message).toMatch(/Too many attempts/);
  });
});
