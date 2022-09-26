const mysql = require("mysql");
const inquirer = require("inquirer");
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
}