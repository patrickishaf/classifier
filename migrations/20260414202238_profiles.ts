import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('profiles', (table) => {
    table.timestamps(true, true);
    table.uuid('id').primary().notNullable();
    table.string('name').unique().notNullable();
    table.timestamp('deleted_at').nullable();
    table.string('gender').notNullable()
    table.float('gender_probability').notNullable();
    table.integer('sample_size').notNullable();
    table.integer('age').notNullable();
    table.string('age_group').notNullable();
    table.string('country_id').notNullable();
    table.float('country_probability').notNullable();
  })
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('profiles')
}

