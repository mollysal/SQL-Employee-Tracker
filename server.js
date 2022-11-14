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
        password: "Mysql123!",
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
    employee.last_name AS Last_Name,
    roles.title AS Title,
    roles.salary AS Salary,
    CONCAT(manager.first_name, ' ', manager.last_name) AS manager
    FROM employee
    LEFT JOIN roles ON employee.role_id = roles.id
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
        let query = `INSERT INTO department (dept_name) VALUES ('${res.addDept}')`;
        connection.query(query, (err, res) => {
            if (err) throw err;
            console.log('Department Added')
            console.table(res);
            firstPrompt();
        })

    })
}

// Add a Role
addRole = () => {
    // // Need to Connect Existing Department to ADD a Role for choices:
    // let query = `
    // SELECT department.id, department.dept_name, roles.salary
    // FROM employee 
    // JOIN roles ON employee.role_id = roles.id
    // JOIN department on department.id = roles.department_id
    // GROUP BY department.id, department.dept_name
    // `

    // connection.query(query, (err, res) => {
    //     if (err) throw err;
    //     const department = res.map(({ id, dept_name }) => ({
    //         value: id,
    //         name: `${id} ${dept_name}`
    //     }));
    //     console.table(res);

    inquirer.prompt([
        {
            type: "input",
            name: "addRole",
            message: "Please type the role you want to add."
        },
        {
            type: "input",
            name: "roleSalary",
            message: "Please type the salary of the role you just added."
        },
        // {
        //     type: "list",
        //     name: "roleDept",
        //     message: "Please enter the department name associated with this role",
        //     choices: department
        // }
    ]).then((res) => {
        // taking the previous inputs into a variable
        const roleData = [res.addRole, res.roleSalary];
        // Need to get Departments from the Department Table
        const getDept = `SELECT dept_name, id FROM department`;
        connection.query(getDept, (err, data) => {
            if (err) throw (err);
            const dept = data.map(({ dept_name, id }) => ({ name: dept_name, value: id }));
            inquirer.prompt([
                {
                    type: "list",
                    name: "roleDept",
                    message: "Please enter the department name associated with this role",
                    choices: dept
                }
            ]).then(updatedAns => {
                const dept = updatedAns.roleDept;
                // Updating roleData array (From above)
                roleData.push(dept);

                // Inserting the new role into the table
                const updateRole = `INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)`;
                connection.query(updateRole, roleData, (err, res) => {
                    if (err) throw err;
                    console.log('New Role has been added!')
                    firstPrompt();
                })

            })
        })
    })
}

// Add an Employee
addEmp = () => {
    inquirer.prompt([
        {
            type: "input",
            name: "firstName",
            message: "Please enter the first name of the new Employee",
        },
        {
            type: "input",
            name: "lastName",
            message: "Please enter the last name of the new Employee",
        },
        {
            type: "input",
            name: "role",
            message: "Please enter the role of the new Employee",
        },
        {
            type: "input",
            name: "manager",
            message: "Please enter the manager of the new Employee",
        }
    ]).then((res) => {
        let query = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES(?, ?, ?, ?)`;
        connection.query(query, [res.firstName, res.lastName, res.role_id, res.manager_id], (err, res) => {
            if (err) { console.log(err) };
            console.log('Employee Created');
            firstPrompt();
        })
    })
}

// Update an Employee Role

