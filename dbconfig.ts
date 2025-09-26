import knex from 'knex';
import config from './knexfile';

const env = process.env.NODE_ENV || 'development';
const cfg = config[env];
const db = knex(cfg);
export default db;
