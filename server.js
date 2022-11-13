const mysql = require("mysql2");
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

// firstPrompt asking user to make their firstSelection from a list
function firstPrompt() {
    inquirer.prompt([
        {
            type: "list",
            name: "firstSelection",
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
                // Bonus: Update Employee Manager, View Employees by Manager, View Employees by Department, Delete Department, Roles & Employees 
            ]
        }
    ]).then((res) => {
        // Once the selection is made run the correlating function
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
    }).catch((err) => {
        if (err) throw err;
    });
};

// View all Dept
viewAllDept = () => {
    let query = `SELECT * FROM department`
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.log("---   Departments   ---");
        console.table(res);
        firstPrompt();
    });
}

// View all Roles
viewAllRoles = () => {
    let query =
        `SELECT
    roles.id AS ID,
    roles.title AS Title,
    roles.salary AS Salary,
    department.dept_name
    FROM roles
    INNER JOIN department ON roles.department_id = department.id
    `
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.log("---   Roles   ---");
        console.table(res);
        firstPrompt();
    });
}

// View all Employees
viewAllEmp = () => {
    let query =
        `SELECT
    employee.id as ID,
    employee.first_name AS First_Name,
    employee.last AS Last_Name,
    roles.title AS Title,
    roles.salary AS Salary,
    CONCAT(manager.first_name, ' ', manager.last_name) AS manager
    FROM employee
    LEFT JOIN roles ON employee.roles_id = roles.id
    LEFT JOIN department ON roles.department_id =  department.id
    LEFT JOIN employee manager ON employee.manager_id = manager.id
    `

    connection.query(query, (err, res) => {
        if (err) throw err;
        console.log("---   Roles   ---");
        console.table(res);
        firstPrompt();
    });
}

// Add a Department
addDept = () => {
    // Prompt to enter name of department
    inquirer.prompt([
        {
            type: "input",
            name: "addDept",
            message: "Please type the name of the department you want to add."
        }
    ]).then((res) => {
        // Dept added to database
        console.log("Department Added")
        let query = `INSERT INTO department (dept_name) VALUES ('${res.addDept}')`;
        connection.query(query, res.addDept, (err, res) => {
            if (err) throw err;
            console.log('Department Added')
            firstPrompt();
        })

    })
}
// Add a Role
addRole = () => {
    // Prompt to enter name of department
    inquirer.prompt([
        {
            type: "input",
            name: "addRole",
            message: "Please type the title of the role you want to add."
        },
        {
            type: "input",
            name: "roleSalary",
            message: "Please type the salary of the role you just added."
        },
        {
            type: "input",
            name: "roleDept",
            message: "Please enter the department name associated with this role"
        }
    ]).then((res) => {
        // Need to add role to a department that already exists 
        let query = `INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)`


        connection.query(query, [res.addRole, res.roleSalary, res.roleDept], (err, res) => {
            if (err) {console.log(err)};
            console.log('Role created');
            firstPrompt();
        })
    })
}

// Add an Employee
addEmp = () => {
    
}

// Update an Employee Role