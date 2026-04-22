const dbConfig = {
  client: 'sqlite3',
  connection: {
    filename: './db.sqlite',
  },
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    tableName: 'knex_migrations',
    directory: './src/db/migrations',
    extension: 'ts',
  },
  seeds: {
    directory: './src/db/seeds',
  }
}

export default dbConfig;