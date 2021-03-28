// Adding dependencies
const inquirer = require('inquirer')
// const mysql = require('mysql');
const connection = require('./connection');

//This file is ignored by git
// const dbCredentials = require('./config')

//Questions Arrays for inquirer
const start_question = [{
    type: 'list',
    name: 'selection',
    message: 'What would you like to do?',
    choices: ["View all Employees", "View All Employees by Department", "View all employees by Role", "Add Employee", "Remove Employee", "Update Employee", "Add Department", "Remove Department", "Add Role", "Remove Role", "Exit"]
}]
//Setting up database connection
// const connection = mysql.createConnection(dbCredentials);
// connection.connect((err)=> {
//     if (err) throw err;
//     console.log('connected');
//     init();
// })

// const pool = mysql.createPool(dbCredentials);

// Functions for searching, adding, updating, etc
function searchAll(){
    connection.query('SELECT employee.first_name as "First Name", employee.last_name as "Last Name", department.name as "Department" FROM role INNER JOIN employee ON employee.role_id = role.id INNER JOIN department on department.id = role.department_id; ',(err,data) => {
        console.table(data);
        init();
    });
};

async function searchByDepartment(){
    const search = await connection.query('SELECT name FROM department');
    const departments = search.map((el)=> el.name);
    await inquirer.prompt([
            {type: 'list',
            name: 'department',
            message: 'Which department did you want to look for?',
            choices: departments,
        }]).then((data)=> {
            const query = 'SELECT employee.first_name as "First Name", employee.last_name as "Last Name", department.name as "Department" FROM role INNER JOIN employee ON employee.role_id = role.id INNER JOIN department on department.id = role.department_id WHERE department.name = ?; ';
            connection.query(query,data.department, (error, results, fields)=> {
                console.table(results);
                init();
            })
        })
}

function searchByRole() {

};

function addEmployee(){

};

function removeEmployee(){

};

function updateEmployee(){

};

function addDepartment(){

};

function removeDepartment(){

};

function addRole(){

};

function removeRole(){

};

function init(){
    inquirer.prompt(start_question)
    .then((data) => {
        switch (data.selection) {
            case "View all Employees":
                searchAll();
                break;
            case "View All Employees by Department":
                searchByDepartment();
                break;
            case "View all employees by Role":
                searchByRole();
                break;
            case "Add Employee":
                addEmployee();
                break;
            case "Remove Employee":
                removeEmployee();
                break;
            case "Update Employee":
                updateEmployee();
                break;
            case "Add Department":
                addDepartment();
                break;
            case "Remove Department":
                removeDepartment();
                break;
            case "Add Role":
                addRole();
                break;
            case "Remove Role":
                removeRole();
                break;
            default: 
            connection.end();
            break;
        }
    })
}
init();