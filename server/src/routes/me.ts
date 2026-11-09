import { Router } from 'express';
import { AppError } from '../lib/AppError.js';
import { User } from '../models/User.js';

export function meRouter() {
  const router = Router();

  router.get('/', async (req, res) => {
    const user = await User.findById(req.userId);
    // Token is valid but the user was deleted: treat as logged out.
    if (!user) throw new AppError(401, 'unauthorized', 'Please log in again.');
    res.json({ id: user.id as string, email: user.email });
  });

  return router;
}
