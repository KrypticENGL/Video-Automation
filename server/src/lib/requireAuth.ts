import type { RequestHandler } from 'express';
import { verifyToken } from '../services/auth.js';
import { AppError } from './AppError.js';

declare module 'express-serve-static-core' {
  interface Request {
    /** Set by requireAuth. */
    userId?: string;
  }
}

export const requireAuth: RequestHandler = (req, _res, next) => {
  const [scheme, token] = (req.headers.authorization ?? '').split(' ');
  if (scheme !== 'Bearer' || !token) {
    throw new AppError(401, 'unauthorized', 'Please log in again.');
  }
  req.userId = verifyToken(token);
  next();
};
