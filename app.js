const { prompt } = require('inquirer')
const {createConnection} = require('mysql2')
require('console.table')

const db = createConnection('mysql://root:rootroot@localhost/employees_db')

// Checking to see if connection works
// db.query('SELECT * FROM employees', (err, data) => {
//   if (err) { console.log(err)}

//   console.log(data)
// })

const start = () => {
  prompt({
    type: 'list',
    name: 'action',
    message: 'Choose one:',
    choices: ['Add Employee', 'Add Department', 'Add Role', 'View Departments', 'View Roles', 'View Employees', 'Update Employees', 'Exit']
  })
  .then(({ action }) => {
    switch (action) {
      case 'Add Employee':
        addEmployee()
        break
      case 'Add Department':
        addDepartment()
        break
      case 'Add Role':
        addRole()
        break
      case 'View Departments':
        viewDepartments()
        break
      case 'View Roles':
        viewRoles()
        break
      case 'View Employees':
        viewEmployees()
        break
      case 'Update Employees':
        updateEmployee()
        break
      case 'Exit':
        process.exit()
    }
  })
  .catch(err => console.log(err))
}

const addEmployee = () => {

}

const addDepartment = () => {

}

const addRole = () => {

}

const viewDepartments = () => {

}

const viewRoles = () => {

}

const viewEmployees = () => {

}

const updateEmployee = () => {

}

start()