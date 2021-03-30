const util = require('util');
const mysql = require('mysql');

// This file is ignored by git
const dbCredentials = require('./config.js');

const connection = mysql.createConnection(dbCredentials);
connection.connect();
connection.query = util.promisify(connection.query);

module.exports = connection;