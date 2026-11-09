import mongoose from 'mongoose';
import { createApp } from './app.js';
import { config } from './config/index.js';
import { logger } from './lib/logger.js';

await mongoose.connect(config.MONGO_URI, { serverSelectionTimeoutMS: 5000 }).catch((err: Error) => {
  logger.fatal(`Cannot connect to MongoDB (${err.message}). Is it running? See PROGRESS.md.`);
  process.exit(1);
});

const server = createApp().listen(config.PORT, () => {
  logger.info(`api listening on http://localhost:${config.PORT}`);
});

for (const signal of ['SIGINT', 'SIGTERM'] as const) {
  process.on(signal, () => {
    server.close(() => void mongoose.disconnect().then(() => process.exit(0)));
  });
}
