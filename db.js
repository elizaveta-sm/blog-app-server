// * the 1st connection method:

// const Pool = require('pg').Pool;
// require('dotenv').config() // for sensitive information

// const pool = new Pool({
//     host: 'aws-0-eu-central-1.pooler.supabase.com',
//     port: 5432,
//     user: process.env.POSTGRES_USER,
//     password: process.env.POSTGRES_PASSWORD,
//     database: process.env.POSTGRES_DATABASE,
//     idleTimeoutMillis: 0,
//     connectionTimeoutMillis: 0,
// }) // how we communicate with the db

// module.exports = pool;


// * the 2nd connection method:

import postgres from 'postgres';

const connectionString = process.env.POSTGRES_URL;
const sql = postgres(connectionString);

export default sql;