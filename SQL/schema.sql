DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;
-- Selecting the database to use
USE employee_db;

-- Creating Tables 
CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30),
);

CREATE TABLE role (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30),
    salery DECIMAL,
    department_id INT NOT NULL,
    FOREIGN KEY (department_id)
);

CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT,
    manager_id INT
);