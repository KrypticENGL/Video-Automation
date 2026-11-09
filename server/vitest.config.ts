import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['test/**/*.test.ts'],
    // Fixed fake values so importing config never needs a real .env.
    env: {
      NODE_ENV: 'test',
      MONGO_URI: 'mongodb://127.0.0.1:27017/reels_test',
      JWT_SECRET: 'test-secret-test-secret-test-secret-1234',
    },
  },
});
