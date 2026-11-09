import express, { type ErrorRequestHandler } from 'express';
import mongoose from 'mongoose';
import { ZodError } from 'zod';
import { AppError } from './lib/AppError.js';
import { logger } from './lib/logger.js';
import { requireAuth } from './lib/requireAuth.js';
import { authRouter } from './routes/auth.js';
import { meRouter } from './routes/me.js';

export function createApp() {
  const app = express();
  app.disable('x-powered-by');
  app.use(express.json({ limit: '100kb' }));

  app.get('/health', (_req, res) => {
    const dbUp = mongoose.connection.readyState === 1;
    res.status(dbUp ? 200 : 503).json({ ok: dbUp });
  });
  app.use('/auth', authRouter());

  // Everything mounted below this line requires a valid JWT.
  app.use(requireAuth);
  app.use('/me', meRouter());

  app.use((_req, _res, next) => next(new AppError(404, 'not_found', 'Not found.')));

  // Express 5 forwards rejected async handlers here, so routes need no try/catch wrapper.
  const onError: ErrorRequestHandler = (err, _req, res, _next) => {
    void _next;
    if (err instanceof AppError) {
      res.status(err.status).json({ error: { code: err.code, message: err.message } });
    } else if (err instanceof ZodError) {
      const message = err.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ');
      res.status(400).json({ error: { code: 'invalid_input', message } });
    } else if (typeof err?.status === 'number' && err.status < 500) {
      // body-parser errors: malformed JSON, body too large
      res.status(err.status).json({ error: { code: 'bad_request', message: 'Bad request.' } });
    } else {
      logger.error({ err }, 'unhandled error');
      res.status(500).json({
        error: { code: 'internal', message: 'Something went wrong. Please try again.' },
      });
    }
  };
  app.use(onError);

  return app;
}
