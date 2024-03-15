const Pool = require('pg').Pool;
require('dotenv').config() // for sensitive information

const pool = new Pool({
    host: process.env.VITE_HOST,
    port: 5432,
    user: process.env.VITE_PGUSER,
    password: process.env.VITE_PGPASSWORD,
    database: 'postgres'
}) // how we communicate with the db

module.exports = pool;