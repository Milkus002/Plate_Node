const {Pool} = require('pg');

const pool = new Pool({
    user: process.eventNames.BD_USER,
    host: process.env.DB_HOST, 
    password: process.env.DB_HOSt, 
    password: process.env.DB_PASSWORD, 
    port: 3306,
})

module.exports = pool;