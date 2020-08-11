const { Pool } = require("pg")

module.exports = new Pool({
    user: 'postgres',
    password: "5d034ee699cc4bc9ac6c48479463f9d9",
    host: "localhost",
    port: 5432,
    database: "launchstoredb"
})