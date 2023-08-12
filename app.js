const inquirer = require("inquirer")
const mysql = require("mysql2")

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "minhasenha",
    database: "employee_tracker"
})

function startApp() {
    inquirer
        .prompt([
            {
                type: "list",
                message: "What would you like to do?",
                name: "choice",
                choices: [
                    "View All Employees?",
                    "View All Employee's By Roles?",
                    "View all Emplyees By Deparments",
                    "Update Employee",
                    "Add Employee?",
                    "Add Role?",
                    "Add Department?"
                ]
            }
        ])
        .then((answers) => {
            switch (answers.choice) {
                case "View All Departments":
                  viewDepartments();
                  break;
                case "View All Roles":
                  viewRoles();
                  break;
                case "View All Employees":
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
                default:
                  console.log("Goodbye!");
                  db.end();
            }
        })
        .catch((error) => {
            console.error(error);
            db.end();
        });
}

startApp();

