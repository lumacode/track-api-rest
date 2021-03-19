const knex = require('knex')({
    client: process.env.APP_DB_CLIENT,
    connection: {
      host : process.env.APP_DB_HOST,
      user : process.env.APP_DB_USER,
      password : process.env.APP_DB_PASSWORD,
      database : process.env.APP_DB_NAME
    }
  });

  module.exports = knex;