const inquirer = require('inquirer')
const mysql = require('mysql');

//This file is ignored by git
const dbCredentials = require('./config')

//Questions Arrays for inquirer
const start_question = [{
    type: 'list',
    name: 'selection',
    message: 'What would you like to do?',
    choices: ["View all Employees", "View All Employees by Department", "View all employees by Role", "Add Employee", "Remove Employee", "Update Employee", "Add Department", "Remove Department", "Add Role", "Remove Role", "Exit"]
}]
//Setting up database connection
var connection = mysql.createConnection(dbCredentials);
connection.connect((err)=> {
    if (err) throw err;
    console.log('connected');
    init();
})

// Functions for searching, adding, updating, etc
function searchAll(){
    connection.query('SELECT employee.first_name as "First Name", employee.last_name as "Last Name", department.name as "Department", FROM role INNER JOIN employee ON employee.role_id = role.id INNER JOIN department on department.id = role.department_id; ',(err,data) => {
        console.table(data);
        init();
    });
};



function init(){
    inquirer.prompt(start_question)
    .then((data) => {
        switch (data.selection) {
            case "View all Employees":
                searchAll();
                break;
            default: 
            connection.end();
                break;
        }
    })
    return;
};