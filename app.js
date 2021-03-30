// Adding dependencies
const inquirer = require('inquirer')
// const mysql = require('mysql');
const connection = require('./db');

//Questions Arrays for inquirer
const start_question = [{
    type: 'list',
    name: 'selection',
    message: 'What would you like to do?',
    choices: ["View All Employees", "View All Employees by Department", "View All Employees by Role", "View All Employees by Manager","Add Employee", "Remove Employee", "Update Employee","View Department Budget", "Add Department", "Remove Department", "Add Role", "Remove Role", "Exit"]
}]

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

async function searchByRole() {
    const search = await connection.query('SELECT title FROM role');
    const roles = search.map((el)=> el.title);
    await inquirer.prompt([
            {type: 'list',
            name: 'role',
            message: 'Which role did you want to look for?',
            choices: roles,
        }]).then((data)=> {
            const query = 'SELECT employee.first_name as "First Name", employee.last_name as "Last Name", department.name as "Department" FROM role INNER JOIN employee ON employee.role_id = role.id INNER JOIN department on department.id = role.department_id WHERE role.title = ?; ';
            connection.query(query,data.role, (error, results, fields)=> {
                console.table(results);
                init();
            })
        })
};

async function addEmployee(){
    const departmentSearch = await connection.query('SELECT name FROM department;')
    const allDepartments = [...new Set(departmentSearch.map(el=>el.name))]
    const questions = await inquirer.prompt([
        {
            type: 'input',
            name: 'first',
            message: "What is the first name of the new employee?"
        },
        {
            type: 'input',
            name: 'last',
            message: 'What is the last name of the new employee?'
        },
        {
            type: 'list',
            name: 'department',
            message: 'What department is this employee in?',
            choices: allDepartments
        },

    ]);
    const  deptQuery = 'SELECT id FROM department WHERE name = ?;';
    const departmentID = await connection.query(deptQuery,questions.department);
    const roleQuery = 'SELECT role.title FROM role INNER JOIN department on department.id = role.department_id WHERE department.id = ?;';
    const roleSearch = await connection.query(roleQuery, departmentID[0].id);
    const roles = [...new Set(roleSearch.map(el=>el.title))]
    const setRole = await inquirer.prompt([
        {
            type: 'list',
            name: 'role',
            message: 'What is the role of this employee?',
            choices: roles
        }
    ]);
    const employeeManager = await connection.query('SELECT role.id FROM role INNER JOIN department ON department.id = role.department_id WHERE role.title = "Manager" AND department.id = ?;',[departmentID[0].id])
    const roleID = await connection.query('SELECT role.id FROM role WHERE role.title = ? AND department_id = ?',[setRole.role, departmentID[0].id]);
    await connection.query('INSERT INTO employee (first_name, last_name, role_id, manager_id)  VALUES (?,?,?,?);',[questions.first, questions.last, roleID[0].id, employeeManager[0].id]);

    init();
};

async function removeEmployee(){
    const employeeSearch = await connection.query('SELECT first_name, last_name, id FROM employee;')
    const employeeList = [...new Set(employeeSearch.map(employee=> ({name: employee.first_name + " " + employee.last_name, id: employee.id})))];
    const employeeInquire = await inquirer.prompt([
        {
            type: 'list',
            name: 'employee',
            message: 'Which employee would you like to remove?',
            choices:employeeList.map(({name,id}) => ({name,value:id}))
        }
    ])
    const removed = await connection.query('DELETE FROM employee WHERE id= ?', employeeInquire.employee)
    init();
};

async function viewByManager(){

}

async function viewDepartmentBudget(){
    const deptSearch = await connection.query('SELECT name FROM department;')
    const dept = await inquirer.prompt([
        {
            type: 'list',
            name: 'name',
            message: 'What department do you want the budget from?',
            choices: deptSearch.map(({name})=> (name))
        }
    ])
    const numOfEmployee = await connection.query('SELECT count(employee.role_id) AS "count", role_id FROM employee INNER JOIN role on role.id = employee.role_id INNER JOIN department on department.id = role.department_id WHERE department.name = ? GROUP BY role_id;', dept.name);
    const roleID = [numOfEmployee.map((el)=> el.role_id)];
    const salaries = await connection.query('SELECT id, title, salary FROM role WHERE id IN (?) GROUP BY id;', roleID);
    
    init();
}

async function updateEmployee(){

};

async function addDepartment(){
    const questions = await inquirer.prompt([
        {
            type: 'input',
            name: 'department',
            message: 'What is the name of the department you want to add?'
        }
    ])
    const addDept = await connection.query('INSERT INTO department (name) VALUES (?);', questions.department);
    init();
};

async function removeDepartment(){
    const deptID = await connection.query('SELECT id, name FROM department;');
    const deptArray = [...new Set(deptID.map(dept=> ({id: dept.id, name: dept.name})))];
    const questions = await inquirer.prompt([
        {
            type: 'list',
            name: 'department_id',
            message: 'What department do you want to remove?',
            choices: deptArray.map(({id,name}) => ({name,value:id}))
        }
    ])
    const removeDept = await connection.query('DELETE FROM department WHERE id= ?;', questions.department_id);
    init();
};

async function addRole(){
    const deptID = await connection.query('SELECT id, name FROM department;');
    const deptArray = [...new Set(deptID.map(dept=> ({id: dept.id, name: dept.name})))];
    const questions = await inquirer.prompt([
        {
            type: 'list',
            name: 'department_id',
            message: 'What department will this employee be in?',
            choices: deptArray.map(({id,name}) => ({name,value:id}))
        },
        {
            type: 'input',
            name: 'title',
            message: 'What is the title of this role?',
        },
        {
            type: 'input',
        name: 'salary',
        message: "What is the salary of this employee?"
        }
    ])
    const addRole = await connection.query('INSERT INTO role (title, salary, department_id) VALUES (?,?,?);', [questions.title, questions.salary ,questions.department_id]);
    init();
};

async function removeRole(){
    const deptID = await connection.query('SELECT id, name FROM department;');
    const deptArray = [...new Set(deptID.map(dept=> ({id: dept.id, name: dept.name})))];
    const questions = await inquirer.prompt([
        {
            type: 'list',
            name: 'department_id',
            message: 'What department is this role in?',
            choices: deptArray.map(({id,name}) => ({name,value:id}))
        },
    ])
    const roles = await connection.query('SELECT id, title FROM role WHERE department_id = ?;', questions.department_id);
    const roleArray = [... new Set(roles.map(role => ({id: role.id, title: role.title})))];
    const roleCheck = roleArray.map(role => role.title)
    const role = await inquirer.prompt([
        {
            type: 'list',
            name: 'role_title',
            message: 'Choose the role you would like to remove from this department.',
            choices: roleCheck
        }
    ])
    const id = roleArray.filter(obj => {
        return obj.title === role.role_title;
    })
    const removeRole = await connection.query('DELETE FROM role WHERE role.id = ? ', id.id);
    init();
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
            case "View All Employees by Manager":
                viewByManager();
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
            case "View Department Budget":
                viewDepartmentBudget();
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