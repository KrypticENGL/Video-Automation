import { pino } from 'pino';
import { config } from '../config/index.js';

export const logger = pino({
  level: config.NODE_ENV === 'test' ? 'silent' : config.LOG_LEVEL,
  redact: {
    paths: [
      'password',
      'passwordHash',
      'token',
      'accessToken',
      'authorization',
      '*.password',
      '*.passwordHash',
      '*.token',
      '*.accessToken',
      '*.authorization',
      'req.headers.authorization',
    ],
    censor: '[redacted]',
  },
});
