'use strict'

const Env = use('Env')
const Helpers = use('Helpers')
const {
  URL
} = require('url');
const JAWSDB_URL = new URL(Env.get('JAWSDB_URL'), 'http://localhost:3333')

module.exports = {
  /*
  |--------------------------------------------------------------------------
  | Default Connection
  |--------------------------------------------------------------------------
  |
  | Connection defines the default connection settings to be used while
  | interacting with SQL databases.
  |
  */
  connection: Env.get('DB_CONNECTION', 'sqlite'),

  /*
  |--------------------------------------------------------------------------
  | Sqlite
  |--------------------------------------------------------------------------
  |
  | Sqlite is a flat file database and can be good choice under development
  | environment.
  |
  | npm i --save sqlite3
  |
  */
  sqlite: {
    client: 'sqlite3',
    connection: {
      filename: Helpers.databasePath(`${Env.get('DB_DATABASE', 'development')}.sqlite`)
    },
    useNullAsDefault: true
  },

  /*
  |--------------------------------------------------------------------------
  | MySQL
  |--------------------------------------------------------------------------
  |
  | Here we define connection settings for MySQL database.
  |
  | npm i --save mysql
  |
  */
  mysql: {
    client: 'mysql',
    connection: {
      host: Env.get('DB_HOST', JAWSDB_URL.hostname),
      port: Env.get('DB_PORT', JAWSDB_URL.port),
      user: Env.get('DB_USER', JAWSDB_URL.username),
      password: Env.get('DB_PASSWORD', JAWSDB_URL.password),
      database: Env.get('DB_DATABASE', JAWSDB_URL.pathname.substr(1))
    },
    debug: true
  },

  /*
  |----------------------------------------------------------------adonis----------
  | PostgreSQL
  |--------------------------------------------------------------------------
  |
  | Here we define connection settings for PostgreSQL database.
  |
  | npm i --save pg
  |
  */
  pg: {
    client: 'pg',
    connection: {
      host: Env.get('DB_HOST', 'localhost'),
      port: Env.get('DB_PORT', ''),
      user: Env.get('DB_USER', 'root'),
      password: Env.get('DB_PASSWORD', ''),
      database: Env.get('DB_DATABASE', 'POS')
    }
  }
}
