const Pool = require('pg').Pool;
require('dotenv').config() // for sensitive information

const pool = new Pool({
    host: 'aws-0-eu-central-1.pooler.supabase.com',
    port: 5432,
    user: process.env.VITE_PGUSER,
    password: process.env.VITE_PGPASSWORD,
    database: 'postgres',
    idleTimeoutMillis: 0,
    connectionTimeoutMillis: 0,
}) // how we communicate with the db

module.exports = pool;