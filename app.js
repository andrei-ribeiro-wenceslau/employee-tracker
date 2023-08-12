const inquirer = require("inquirer")
const mysql = require("mysql2")

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "minhasenha",
    database: "employee_tracker"
})

function viewDepartments() {
    db.query("SELECT department.name AS department FROM department", (err, results) => {
        if (err) throw err;

        console.table(results);
        startApp();
    });
}

function viewRoles() {
    db.query("SELECT role.title AS role, role.salary, department.name AS department_name FROM role INNER JOIN department ON role.department_id = department.id", (err, results) => {
        if (err) throw err;

        console.table(results);
        startApp();
    });
}

function viewEmployees() {
    db.query("SELECT employee.first_name, employee.last_name , role.title AS job_title, department.name AS department, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee manager ON employee.manager_id = manager.id", (err, results) => {
        if (err) throw err;

        console.table(results);
        startApp();
    });
}

function addDepartment() {
    inquirer.prompt([
        {
            type: "input",
            message: "Enter the name of the department:",
            name: "name"
        }
    ])
        .then((answer) => {
            db.query("INSERT INTO department (name) VALUES (?)", answer.name, (err, results) => {
                if (err) throw err;
                console.log("Department added successfully!");
                startApp();
            });
        });
}

function addRole() {

    db.query("SELECT * FROM department", (err, departments) => {
        if (err) throw err;

        const departmentChoices = departments.map((department) => {
            return {
                name: department.name,
                value: department.id
            };
        });

        inquirer.prompt([
            {
                type: "input",
                message: "Enter the title of the role:",
                name: "title"
            },
            {
                type: "input",
                message: "Enter this role's salary:",
                name: "salary"
            },
            {
                type: "list",
                message: "Select the department this role belongs to:",
                name: "department_id",
                choices: departmentChoices
            }
        ])
            .then((answer) => {
                db.query("INSERT INTO role SET ?",
                    {
                        title: answer.title,
                        salary: answer.salary,
                        department_id: answer.department_id
                    },
                    (err, results) => {
                        if (err) throw err;
                        console.log("Role added successfully!");
                        startApp();
                    });
            });
    });
}

function addEmployee() {
    db.query("SELECT * FROM role", (err, roles) => {
        if (err) throw err;

        const roleChoices = roles.map((role) => {
            return {
                name: role.title,
                value: role.id
            };
        });

        db.query("SELECT * FROM employee", (err, employees) => {
            if (err) throw err;

            const managerChoices = [
                {
                    name: "None",
                    value: null
                },
                ...employees.map((employee) => {
                    return {
                        name: `${employee.first_name} ${employee.last_name}`,
                        value: employee.id
                    };
                })
            ];

            inquirer.prompt([
                {
                    type: "input",
                    message: "Enter the employee's first name:",
                    name: "firstName"
                },
                {
                    type: "input",
                    message: "Enter the employee's last name:",
                    name: "lastName"
                },
                {
                    type: "list",
                    message: "Select this employee's role:",
                    name: "role_id",
                    choices: roleChoices
                },
                {
                    type: "list",
                    message: "Select this employee's manager:",
                    name: "manager_id",
                    choices: managerChoices
                }
            ])
                .then((answer) => {
                    db.query("INSERT INTO employee SET ?",
                        {
                            first_name: answer.firstName,
                            last_name: answer.lastName,
                            role_id: answer.role_id,
                            manager_id: answer.manager_id
                        },
                        (err, results) => {
                            if (err) throw err;
                            console.log("Employee added successfully!");
                            startApp();
                        });
                });
        });
    });
}

function updateEmployeeRole() {
    db.query("SELECT * FROM employee", (err, employees) => {
        if (err) throw err;

        const employeeChoices = employees.map((employee) => {
            return {
                name: `${employee.first_name} ${employee.last_name}`,
                value: employee.id
            };
        });

        db.query("SELECT * FROM role", (err, roles) => {
            if (err) throw err;

            const roleChoices = roles.map((role) => {
                return {
                    name: role.title,
                    value: role.id
                };
            });

            inquirer.prompt([
                {
                    type: "list",
                    message: "Select the employee you want to update the role for:",
                    name: "employee_id",
                    choices: employeeChoices
                },
                {
                    type: "list",
                    message: "Select the new role for the employee:",
                    name: "new_role_id",
                    choices: roleChoices
                }
            ])
                .then((answer) => {
                    db.query("UPDATE employee SET role_id = ? WHERE id = ?",
                        [answer.new_role_id, answer.employee_id],
                        (err, results) => {
                            if (err) throw err;
                            console.log("Employee role updated successfully!");
                            startApp();
                        });
                });
        });
    });
}

function startApp() {
    inquirer
        .prompt([
            {
                type: "list",
                message: "What would you like to do?",
                name: "choice",
                choices: [
                    "View all Employees",
                    "View all Roles",
                    "View all Departments",
                    "Add Employee",
                    "Update Employee Role",
                    "Add Role",
                    "Add Department",
                    "Exit"
                ]
            }
        ])
        .then((answers) => {
            switch (answers.choice) {
                case "View all Departments":
                    viewDepartments();
                    break;
                case "View all Roles":
                    viewRoles();
                    break;
                case "View all Employees":
                    viewEmployees();
                    break;
                case "Add Department":
                    addDepartment();
                    break;
                case "Add Role":
                    addRole();
                    break;
                case "Add Employee":
                    addEmployee();
                    break;
                case "Update Employee Role":
                    updateEmployeeRole();
                    break;
                case "Exit":
                    console.log("Goodbye!");
                    db.end();
                    break;
            }
        })
        .catch((error) => {
            console.error(error);
            db.end();
        });
}

startApp();

