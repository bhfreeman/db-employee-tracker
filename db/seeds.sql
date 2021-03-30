USE employee_db;
INSERT INTO department (name)
VALUES ("Marketing");

INSERT INTO department (name)
VALUES ("Human Resources");

INSERT INTO role (title, salary, department_id)
VALUES ("Manager", 100000, 1);

INSERT INTO role (title, salary, department_id)
VALUES ("Designer", 500000, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Marissa", "Freeman", 1, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Brett", "Freeman", 2,1);