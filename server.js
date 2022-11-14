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
        }
    ]).then((res) => {
        // taking the previous inputs into a variable
        const roleData = [res.addRole, res.roleSalary];
        // Need to get Departments from the Department Table
        const getDept = `SELECT dept_name, id FROM department`;
        connection.query(getDept, (err, data) => {
            if (err) throw (err);
            // Mapping the department data into choices for Inquirer Prompt
            const dept = data.map(({ dept_name, id }) => ({ name: dept_name, value: id }));
            inquirer.prompt([
                {
                    type: "list",
                    name: "roleDept",
                    message: "Please enter the department name associated with this role",
                    choices: dept
                }
            ]).then(updatedAns => {
                // Adding department answer to a variable
                const dept = updatedAns.roleDept;
                // Updating roleData array (From above)
                roleData.push(dept);

                // Inserting the new role into the ROLES table
                const updateRole = `INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)`;
                connection.query(updateRole, roleData, (err, res) => {
                    if (err) throw err;
                    console.log('--- New Role has been added! ---')
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
        }
        // After Inputting name, the employee needs a role
    ]).then((res) => {
        // taking the previous inputs into a variable
        const empData = [res.firstName, res.lastName];
        // Need to get Roles from the Roles Table
        const getRoles = `SELECT roles.id, roles.title FROM roles`;
        connection.query(getRoles, (err, data) => {
            if (err) throw (err);
            // Mapping the roles data into choices for Inquirer Prompt
            const roles = data.map(({ title, id }) => ({ name: title, value: id }));
            inquirer.prompt([
                {
                    type: "list",
                    name: "roles",
                    message: "Please enter the employees role",
                    choices: roles
                }
            ]).then(updatedAns => {
                // Adding department answer to a variable
                const roles = updatedAns.roles;
                // Updating empData (Employee Data) array (From above)
                empData.push(roles);

                // Gather all from Employee, the new Employee needs a manager
                const managersQuery = `SELECT * FROM employee`;
                connection.query(managersQuery, (err, res) => {
                    if (err) throw err;
                    // Mapping the manager data into choices for Inquirer Prompt
                    const managers = res.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));
                    inquirer.prompt([
                        {
                            type: "list",
                            name: "managers",
                            message: "Please enter the employees manager",
                            choices: managers
                        }
                    ]).then(updatedAns => {
                        // Adding manager answer to a variable
                        const manager = updatedAns.manager;
                        // Updating empData (Employee Data) array (From above)
                        empData.push(manager);

                        const newEmployee = `INSERT INTO  employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;

                        connection.query(newEmployee, empData, (err, res) => {
                            if (err) throw err;
                            console.log('--- NEW Employee has bee added ---');
                            firstPrompt();
                        })
                    })
                })

            })
        })
    })
}
// Update an Employee Role
updateEmpRole = () => {
    // Need to gather an Employee to update
    const getEmp = `SELECT * FROM employee`;

    // Need to map the employees for Inquirer Prompt
    connection.query(getEmp, (err, res) => {
        if (err) throw err;
        const emp = res.map(({ id, first_name, last_name}) => ({ name: first_name + " " + last_name, value: id}));

        inquirer.prompt([
            {
                type: 'list',
                name: 'employee',
                message: 'What Employee do you want to update?',
                choices: emp
            }
        ]).then((updateAns) => {
            const updateEmp = updateAns.employee;
            // declaring new variable for updated employee array
            const employeeData = [];
            employeeData.push(updateEmp);

            // Gather Role info
            const roleQuery = `SELECT * FROM roles`;

            connection.query(roleQuery, (err, res) => {
                const roleChoices = res.map(({ title, id}) => ({ name: title, value: id }));
                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'roles',
                        message: "Please update the Employee's Role: ",
                        choices: roleChoices
                    }
                ]).then(updateAns => {
                    const newRole = updateAns.roles;
                    employeeData.push(newRole);

                    const updateEmp = `UPDATE employee SET role_id = ? where id =?`;
                    connection.query(updateEmp, employeeData, (err, res) => {
                        if (err) throw err;
                        console.log('--- Employee has been Updated! ---');

                        firstPrompt();
                    })

                })
            })
        })
    })
}
