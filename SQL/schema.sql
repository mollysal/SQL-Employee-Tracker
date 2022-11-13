DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;
-- Selecting the database to use
USE employee_db;

-- Creating Tables 
CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    dept_name VARCHAR(30)
);

CREATE TABLE roles (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30),
    salary DECIMAL,
    department_id INT
    Foreign Key (department_id) REFERENCES (department(id))
);

CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT,
    manager_id INT
    Foreign Key (roled_id) REFERENCES (roles(id))
    Foreign Key (manager_id) REFERENCES (employee(id))
);