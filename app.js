const inquirer = require('inquirer')
const mysql = require('mysql');

const dbCredentials = require('./config')

//Setting up database connection
var connection = mysql.createConnection(dbCredentials);


