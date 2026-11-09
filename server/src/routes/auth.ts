import { Router } from 'express';
import { rateLimit } from 'express-rate-limit';
import { z } from 'zod';
import { login } from '../services/auth.js';

const loginBody = z.object({
  email: z.email().max(254),
  password: z.string().min(1).max(200),
});

export function authRouter() {
  const router = Router();

  // shortcut: in-memory, per-IP limiter; fine for one api process. Behind Caddy (Part 7) set
  // `trust proxy` so the limit is per client, not per proxy.
  const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: {
      error: { code: 'rate_limited', message: 'Too many attempts. Try again in a few minutes.' },
    },
  });

  router.post('/login', loginLimiter, async (req, res) => {
    const { email, password } = loginBody.parse(req.body);
    res.json(await login(email, password));
  });

  return router;
}
