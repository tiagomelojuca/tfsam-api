const knex = require('knex');

const db = knex({
    client: 'mysql',
    connection: {
        host : '127.0.0.1',
        user : 'root',
        password : '',
        database : 'tfsam'
    }
});

module.exports = db;