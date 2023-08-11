INSERT INTO department (name)
VALUES ("Sales"),
("Engineering"),
("Finance"),
("Legal");

INSERT INTO role (title, salary, department_id)
VALUES ("Lead Engineer", 150000, 2),
("Legal Team Lead", 250000, 4),
("Accountant", 125000, 3),
("Sales Lead", 100000, 1),
("Salesperson", 80000, 1),
("Software Engineer", 120000, 2),
("Lawyer", 190000, 4);

INSERT INTO employee (first_name, last_name, manager_id, role_id)
VALUES ("Michael", "Jackson", null, 1),
("Lebron", "James", null, 2),
("Steph","Curry",null,3),
("Cristiano", "Ronaldo", 1, 4),
("Sam", "Kerr", 4, 5),
("James", "Harden", 1, 6),
("Tom", "Brady", 2, 7);