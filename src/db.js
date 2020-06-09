const knex = require('knex');
const config = require('./config.json');

const db = knex({
    client: 'mysql',
    connection: {
        host: config.connection.host,
        user: config.connection.user,
        password: config.connection.password,
        database: config.connection.database
    }
});

module.exports = db;