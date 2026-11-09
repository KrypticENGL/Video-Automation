import { describe, expect, it } from 'vitest';
import { loadConfig } from '../src/config/index.js';

const valid = { MONGO_URI: 'mongodb://127.0.0.1:27017/x', JWT_SECRET: 'a'.repeat(32) };

describe('loadConfig', () => {
  it('applies defaults', () => {
    expect(loadConfig(valid)).toMatchObject({ PORT: 4000, NODE_ENV: 'development' });
  });

  it('coerces PORT', () => {
    expect(loadConfig({ ...valid, PORT: '5000' }).PORT).toBe(5000);
  });

  it('lists every problem in one readable message', () => {
    expect(() => loadConfig({ JWT_SECRET: 'short' })).toThrowError(
      /MONGO_URI[\s\S]*JWT_SECRET: must be at least 32 characters/,
    );
  });
});
