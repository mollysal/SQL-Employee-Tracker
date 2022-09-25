USE employee_db;

INSERT INTO department (dept_name)
VALUES ("Engineering"),
        ("UI/UX DESIGN"),
        ("Accounting"),
        ("Legal");

INSERT INTO roles (title, salery, department_id)
VALUES ("Lead Engineer", 150000, 1),
        ("Jr. Engineer", 90000, 1),
        ("Lead UI/UX Designer", 95000, 2),
        ("Jr. UI/UX Designer", 85000, 2),
        ("Lead Accountant", 100000, 3),
        ("Jr. Accountant", 87000, 3),
        ("Lead Lawyer", 200000, 4),
        ("Jr. Lawyer", 150000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Tony", "Stark", 1, 3),
        ("Bruce", "Banner", 2, 1),
        ("Natasha", "Romanova", 3, NULL),
        ("Steve", "Rogers", 4, 2),
        ("Clint", "Barton", 5, 1),
        ("Doctor", "Strange", 6, NULL),
        ("Peter", "Quill", 7, 8),
        ("Peter", "Parker", 8, 6);