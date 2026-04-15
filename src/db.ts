import knex from 'knex';
import dbConfig from '../knexfile';

const db = knex(dbConfig);

const getDB = () => db;

export default getDB;