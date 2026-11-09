import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import { AppError } from '../lib/AppError.js';
import { User } from '../models/User.js';

// shortcut: 30-day token with no refresh and no server-side revocation (logout only forgets it on
// the phone); add a tokenVersion on User if a leaked token ever needs to be killed early.
const TOKEN_TTL = '30d';
const BCRYPT_ROUNDS = 12;
// Compared against when the email is unknown, so response time doesn't reveal which emails exist.
// A precomputed 12-round hash of a throwaway string (must match BCRYPT_ROUNDS).
const DUMMY_HASH = '$2b$12$TC2JfbqEkN9QCGfwjLKFV.8Te2aHUKZOZqsBBnDLVHsGFAbVBE9I.';

export const hashPassword = (password: string) => bcrypt.hash(password, BCRYPT_ROUNDS);

export const signToken = (userId: string) =>
  jwt.sign({}, config.JWT_SECRET, { subject: userId, expiresIn: TOKEN_TTL, algorithm: 'HS256' });

/** Returns the userId, or throws AppError 401. */
export function verifyToken(token: string): string {
  try {
    const payload = jwt.verify(token, config.JWT_SECRET, { algorithms: ['HS256'] });
    if (typeof payload === 'object' && payload.sub) return payload.sub;
  } catch {
    // fall through to the 401 below
  }
  throw new AppError(401, 'unauthorized', 'Please log in again.');
}

export async function login(email: string, password: string): Promise<{ token: string }> {
  const user = await User.findOne({ email: email.toLowerCase() });
  const ok = await bcrypt.compare(password, user?.passwordHash ?? DUMMY_HASH);
  if (!user || !ok) throw new AppError(401, 'invalid_credentials', 'Wrong email or password.');
  return { token: signToken(user.id as string) };
}
