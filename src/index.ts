import dotenv from 'dotenv';
import app from './app';
import { handleException, handleRejection } from './util';
import getDB, { runSeed } from './db';

dotenv.config();

async function main() {
  const db = getDB()
  await runSeed(db);
  const port = process.env.PORT ?? '8080';
  app.listen(port, () => console.log('server listening on port ' + port));
  process.on('uncaughtException', handleException).on('unhandledRejection', handleRejection);
}

main().catch(err => console.error('failed to run application.', err.message, err));