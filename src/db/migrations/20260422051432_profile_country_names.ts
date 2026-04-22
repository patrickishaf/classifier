import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('profiles', (table) => {
    table.string('country_name').nullable();
    table.dropColumns('updated_at', 'sample_size');
  });
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('profiles', (table) => {
    table.dropColumn('country_name');
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.integer('sample_size').notNullable();
  })
}

