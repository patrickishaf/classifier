import knex from 'knex';
import dbConfig from '../knexfile';
import { attachPaginate } from 'knex-paginate';
import { join } from 'node:path';
import { v7 as uuid } from 'uuid';
import { readFileSync } from 'fs';

const db = knex(dbConfig);
attachPaginate();

const getDB = () => db;

export const runSeed = async (DB: knex.Knex) => {
  await DB('profiles').del();

  const json = JSON.parse(readFileSync(join(process.cwd(), 'src', 'db/seed_profiles.json'), 'utf-8'));

  const profiles = json.profiles.map(d => ({
    ...d,
    id:uuid(),
  }));

  await DB.transaction(async (trx) => {
    await trx.batchInsert('profiles', profiles, 100);
  });
}

export default getDB;