const mysql = require("mysql");
const inquirer = require("inquirer");
const { connect } = require("http2");
require("console.table");

// mysql connection
// Connect to database
const connection = mysql.createConnection(
    {
        host: "localhost",
        port: 3306,
        // MySQL username,
        user: "root",
        // MySQL password
        password: " ",
        database: "employee_db"
    },
    console.log(`Connected to the employee_db database.`)
);

connection.connect(function (err) {
    if (err) {
        return console.error('error: ' + err.message);
    }

    console.log("--   Employee Tracker   ---");
    console.log("");
    console.log("---------------------------");
    // After connection - run the first Prompt (firstSelection)
    firstPrompt();
});

// firstPromt asking user to make their firstSelection from a list
function firstPrompt() {
    inquirer.prompt([
        {
            type: "list",
            name: "firstSelction",
            message: "What do you want to do?",
            choices: [
                'View All Departments',
                'View all Roles',
                'View all Employees',
                'Add a Department',
                'Add a Role',
                'Add an Employee',
                'Update an Employee Role',
                'Exit'
            ]
        }
    ]).then((res) => {
        // Once the selction is made run the correlating function
        console.log(res.firstSelection);
        switch (res.firstSelection) {
            case 'View All Departments':
                viewAllDept();
                break;
            case 'View all Roles':
                viewAllRoles();
                break;
            case 'View all Employees':
                viewAllEmp();
                break;
            case 'Add a Department':
                addDept();
                break;
            case 'Add a Role':
                addRole();
                break;
            case 'Add an Employee':
                addEmp();
                break;
            case 'Update an Employee Role':
                updateEmpRole();
                break;
            case 'Exit':
                connection.end();
                break;
        }
    }).catch((err) =>{
        if(err)throw err;
    });
};

// View all Dept
function viewAllDept() {
    let query = 
    `SELECT
    department.id,
    department.dept_name AS department
    FROM department
    `
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.log("---   Departments   ---");
        console.table(res);
        firstPrompt();
    });
}

// View all Roles
function viewAllRoles() {
    let query = 
    `SELECT
    roles.id AS ID,
    roles.title AS Title,
    roles.salery AS Salery
    department.dept_name AS department
    FROM roles
    INNER JOIN deparment ON roles.department_id = deptarment.id
    `
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.log("---   Roles   ---");
        console.table(res);
        firstPrompt();
    });
}

// View all Employees
function viewAllEmp() {
    let query = 
    `SELECT
    employee.id,
    employee.first_name AS First_Name,
    employee.last AS Last_Name,
    roles.title AS Title,
    roles.salery AS Salery.
    department.dept_name AS department
    FROM employee
    INNER JOIN roles ON roles.id = employee.role_id
    INNER JOIN department ON deparment.id = roles.department_id
    LEFT JOIN employees
    `
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.log("---   Roles   ---");
        console.table(res);
        firstPrompt();
    });
}

// Add a Department

// Add a Role

// Add an Employee

// Update an Employee Role