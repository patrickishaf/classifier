const dbConfig = {
  client: 'better-sqlite3',
  connection: {
    filename: './db.sqlite',
  },
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    tableName: 'knex_migrations',
    directory: './migrations',
    extension: 'ts',
  },
  seeds: {
    directory: './seeds',
  }
}

export default dbConfig;