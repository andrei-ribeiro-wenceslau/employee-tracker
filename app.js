const inquirer = require("inquirer")
const mysql = require("mysql2")

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "minhasenha",
    database: "employee_tracker"
  });