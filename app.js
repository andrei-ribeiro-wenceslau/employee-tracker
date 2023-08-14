// Import required modules
const inquirer = require("inquirer")
const mysql = require("mysql2")

// Create a connection to the MySQL database
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "minhasenha",
    database: "employee_tracker"
})

// Function to view departments
function viewDepartments() {

    // Query the database to fetch department names
    db.query("SELECT department.name AS department FROM department", (err, results) => {
        if (err) throw err;

        // Display department names in a table format
        console.table(results);
        // Prompt the user to continue using the application
        startApp();
    });
}

// Function to view roles
function viewRoles() {

    // Query the database to fetch role information along with department names
    db.query("SELECT role.title AS role, role.salary, department.name AS department_name FROM role INNER JOIN department ON role.department_id = department.id", (err, results) => {
        if (err) throw err;

        // Display role information in a table format
        console.table(results);
        // Prompt the user to continue using the application
        startApp();
    });
}

// Function to view employees
function viewEmployees() {

    // Query the database to fetch employee information along with related role and manager information
    db.query("SELECT employee.first_name, employee.last_name , role.title AS job_title, department.name AS department, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee manager ON employee.manager_id = manager.id", (err, results) => {
        if (err) throw err;

        // Display employee information in a table format
        console.table(results);
        // Prompt the user to continue using the application
        startApp();
    });
}

// Function to add a new department
function addDepartment() {

    // Prompt the user to enter the name of the new department
    inquirer.prompt([
        {
            type: "input",
            message: "Enter the name of the department:",
            name: "name"
        }
    ])
        .then((answer) => {
            // Insert the new department into the database
            db.query("INSERT INTO department (name) VALUES (?)", answer.name, (err, results) => {
                if (err) throw err;
                console.log("Department added successfully!");
                // Prompt the user to continue using the application
                startApp();
            });
        });
}

// Function to add a new role
function addRole() {

    // Query the database to fetch existing department data
    db.query("SELECT * FROM department", (err, departments) => {
        if (err) throw err;

        // Create choices for department selection using retrieved data
        const departmentChoices = departments.map((department) => {
            return {
                name: department.name,
                value: department.id
            };
        });

        // Prompt the user to enter details for the new role
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
                // Insert the new role into the database
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

// Function to add a new employee
function addEmployee() {

    // Query the database to fetch existing role data
    db.query("SELECT * FROM role", (err, roles) => {
        if (err) throw err;

        // Create choices for role selection using retrieved data
        const roleChoices = roles.map((role) => {
            return {
                name: role.title,
                value: role.id
            };
        });

         // Query the database to fetch existing employee data
        db.query("SELECT * FROM employee", (err, employees) => {
            if (err) throw err;

            // Create choices for manager selection using retrieved data
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

            // Prompt the user to enter details for the new employee
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
                // Insert the new employee into the database
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

// Function to update an employee's role
function updateEmployeeRole() {
    
    // Query the database to fetch existing employee data
    db.query("SELECT * FROM employee", (err, employees) => {
        if (err) throw err;

        // Create choices for employee selection using retrieved data
        const employeeChoices = employees.map((employee) => {
            return {
                name: `${employee.first_name} ${employee.last_name}`,
                value: employee.id
            };
        });

         // Query the database to fetch existing role data
        db.query("SELECT * FROM role", (err, roles) => {
            if (err) throw err;

            // Create choices for role selection using retrieved data
            const roleChoices = roles.map((role) => {
                return {
                    name: role.title,
                    value: role.id
                };
            });
            // Prompt the user to select an employee and a new role
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
                 // Update the employee's role in the database
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

// Function to start the application and display the main menu
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
            // Based on the user's choice, invoke corresponding functions
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
                    db.end(); // Close the database connection
                    break;
            }
        })
        .catch((error) => {
            console.error(error);
            db.end(); // Close the database connection in case of an error
        });
}

// Start the application by calling the startApp function
startApp();

