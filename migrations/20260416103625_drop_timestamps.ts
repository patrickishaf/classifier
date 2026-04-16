import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('profiles', (table) => {
    table.dropColumn('deleted_at');
  })
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('profiles', (table)=> {
    table.timestamp('deleted_at').nullable();
  })
}

