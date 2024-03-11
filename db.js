const Pool = require('pg').Pool;
require('dotenv').config() // for sensitive information

const pool = new Pool({
    host: process.env.HOST,
    port: 5432,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: 'postgres'
}) // how we communicate with the db

module.exports = pool;