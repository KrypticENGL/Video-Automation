// Creates the client user, or resets their password, from SEED_USER_EMAIL / SEED_USER_PASSWORD.
import mongoose from 'mongoose';
import { z } from 'zod';
import { config } from '../config/index.js';
import { User } from '../models/User.js';
import { hashPassword } from '../services/auth.js';

const parsed = z
  .object({ SEED_USER_EMAIL: z.email(), SEED_USER_PASSWORD: z.string().min(10).max(200) })
  .safeParse(process.env);
if (!parsed.success) {
  console.error(
    'Set SEED_USER_EMAIL (a valid email) and SEED_USER_PASSWORD (10 to 200 characters) in server/.env.',
  );
  process.exit(1);
}

await mongoose.connect(config.MONGO_URI, { serverSelectionTimeoutMS: 5000 }).catch((err: Error) => {
  console.error(`Cannot connect to MongoDB (${err.message}). Is it running? See PROGRESS.md.`);
  process.exit(1);
});
const email = parsed.data.SEED_USER_EMAIL.toLowerCase();
await User.updateOne(
  { email },
  { passwordHash: await hashPassword(parsed.data.SEED_USER_PASSWORD) },
  { upsert: true },
);
console.log(`User ready: ${email}`);
await mongoose.disconnect();
