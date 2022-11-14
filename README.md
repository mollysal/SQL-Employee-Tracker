# SQL-Employee-Tracker
Module 12 Challenge: SQL-Employee-Tracker

## Table of Contents
- [SQL-Employee-Tracker](#sql-employee-tracker)
  - [Table of Contents](#table-of-contents)
  - [Description](#description)
  - [User Story](#user-story)
  - [Acceptance Criteria](#acceptance-criteria)
  - [Set-up](#set-up)
    - [Database Schema](#database-schema)
    - [Command Line Example](#command-line-example)
  - [Technology Used](#technology-used)
  - [Resources](#resources)

## Description
This is a command-line application to manage a company's employee database, using Node.js, Inquirer, & MySQL. 

## User Story

```md
AS A business owner
I WANT to be able to view and manage the departments, roles, and employees in my company
SO THAT I can organize and plan my business
```

## Acceptance Criteria

```md
GIVEN a command-line application that accepts user input
WHEN I start the application
THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
WHEN I choose to view all departments
THEN I am presented with a formatted table showing department names and department ids
WHEN I choose to view all roles
THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
WHEN I choose to view all employees
THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
WHEN I choose to add a department
THEN I am prompted to enter the name of the department and that department is added to the database
WHEN I choose to add a role
THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
WHEN I choose to add an employee
THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
WHEN I choose to update an employee role
THEN I am prompted to select an employee to update and their new role and this information is updated in the database 
```

## Set-up
```
npm i
```
```
mysql -u root -p 
```
Enter your MySQL password

```
source SQL/Schema.sql
source SQL/seeds.sql
EXIT;
node server.js
```
### Database Schema
![Database schema includes tables labeled “employee,” role,” and “department.”](./Assets/12-sql-homework-demo-01.png)

### Command Line Example
![Command line example - Viewing All Employees](Assets/MySQL-All%20Employees.png)

## Technology Used
* JavaScript
* Node.js
* MySQL
* Inquirer

## Resources
https://www.mysqltutorial.org/mysql-nodejs/connect/ 
https://www.sqlines.com/mysql/set_foreign_key_checks 

