import knex from 'knex';
import dbConfig from '../knexfile';
import { attachPaginate } from 'knex-paginate';

const db = knex(dbConfig);
attachPaginate();

const getDB = () => db;

export default getDB;