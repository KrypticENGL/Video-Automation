import type { Agenda } from 'agenda';
import { logger } from '../lib/logger.js';

/** Demo job proving the queue works end to end. Real jobs follow this shape: one file, one define. */
export function defineHealthcheck(agenda: Agenda) {
  agenda.define('healthcheck', async () => {
    logger.info('healthcheck job ran');
  });
}
