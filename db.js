const Pool = require('pg').Pool;
require('dotenv').config() // for sensitive information

const pool = new Pool({
    host: import.meta.env.VITE_HOST,
    port: 5432,
    user: import.meta.env.VITE_PGUSER,
    password: import.meta.env.VITE_PGPASSWORD,
    database: 'postgres'
}) // how we communicate with the db

module.exports = pool;