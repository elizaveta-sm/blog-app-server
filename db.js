const Pool = require('pg').Pool;
require('dotenv').config() // for sensitive information

const pool = new Pool({
    host: process.env.POSTGRES_HOST,
    port: 5432,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
    idleTimeoutMillis: 0,
    connectionTimeoutMillis: 0,
}) // how we communicate with the db

module.exports = pool;