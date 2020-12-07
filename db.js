const Pool = require('pg').Pool;

const pool = new Pool({
    user: "postgres",
    password: "Luigi44",
    host: "localhost",
    port: 5432,
    database: "reco"
});

module.exports = pool;