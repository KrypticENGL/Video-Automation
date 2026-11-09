import { MongoBackend } from '@agendajs/mongo-backend';
import { Agenda } from 'agenda';
import mongoose from 'mongoose';
import { config } from './config/index.js';
import { defineHealthcheck } from './jobs/healthcheck.js';
import { logger } from './lib/logger.js';

// Mongoose is for our models inside jobs; Agenda keeps its own connection to the same database.
await mongoose.connect(config.MONGO_URI, { serverSelectionTimeoutMS: 5000 }).catch((err: Error) => {
  logger.fatal(`Cannot connect to MongoDB (${err.message}). Is it running? See PROGRESS.md.`);
  process.exit(1);
});

const agenda = new Agenda({
  backend: new MongoBackend({ address: config.MONGO_URI }),
  processEvery: '5 seconds',
});
agenda.on('fail', (err: Error, job: { attrs: { name: string } }) => {
  logger.error({ err, job: job.attrs.name }, 'job failed');
});

defineHealthcheck(agenda);

await agenda.start();
await agenda.every('1 minute', 'healthcheck');
logger.info('worker started');

for (const signal of ['SIGINT', 'SIGTERM'] as const) {
  process.on(signal, () => {
    void agenda
      .stop()
      .then(() => mongoose.disconnect())
      .then(() => process.exit(0));
  });
}
