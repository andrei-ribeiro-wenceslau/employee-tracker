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
            inquirer.prompt([
                {
                    type: "input",
                    message: "Enter the name of the role:",
                    name: "name"
                }
            ])
                .then((answer) => {
                    db.query("INSERT INTO role (title) VALUES (?)", answer.name, (err, results) => {
                        if (err) throw err;
                        console.log("Role added successfully!");
                        startApp();
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
                            "Update Employee",
                            "Add Employee",
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
                            // addEmployee();
                            break;
                        case "Update Employee Role":
                            // updateEmployeeRole();
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

