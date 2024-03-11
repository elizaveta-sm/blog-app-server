const Pool = require('pg').Pool;
require('dotenv').config() // for sensitive information

const pool = new Pool({
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    host: process.env.HOST,
    database: 'blog-app'
}) // how we communicate with the db

module.exports = pool;