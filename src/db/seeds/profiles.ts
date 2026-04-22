import type { Knex } from 'knex';
import { v7 as uuid } from 'uuid';
import { readFileSync } from 'fs';
import { join } from 'path';

const json = JSON.parse(readFileSync(join(process.cwd(), 'src', 'db/seed_profiles.json'), 'utf-8'));

export async function seed(knex: Knex): Promise<void> {
    await knex('profiles').del();

    const profiles = json.profiles.map(d => ({
      ...d,
      id:uuid(),
    }));

    await knex.transaction(async (trx) => {
      await trx.batchInsert('profiles', profiles, 100);
    });
};
