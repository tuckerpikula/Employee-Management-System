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
  prompt([
    {
      type: 'input',
      name: 'firstName',
      message: "What's your first name?"
    },
    {
      type: 'input',
      name: 'lastName',
      message: "What's your last name?"
    },
    {
      type: 'input',
      name: 'roleId',
      message: "What's the role ID for this employee?"
    },
    {
      type: 'input',
      name: 'managerId',
      message: "What's this employee's manager ID?"
    }
  ])
  .then(employee => {
    let newEmployee = {
      first_name: employee.firstName,
      last_name: employee.lastName,
      role_id: employee.roleId,
      manager_id: employee.managerId
    }
    db.query('INSERT INTO employees SET ?', newEmployee, (err) => {
      if (err) { console.log(err)}
      console.log('The new employee has been added!')
      start()
    })
  })
}

const addDepartment = () => {
  prompt([
    {
    type: 'input',
    name: 'add',
    message: 'What is the name of the department you want to add?'
    },
  ])
  .then(departments => {
    let newDepartment = {
      name: department.add
    }
    db.query('INSERT INTO departments SET ?', newDepartment, (err) => {
      if (err) { console.log(err)}
      console.log('You have made a new department!')
      start()
    })
  })
}

const addRole = () => {
  prompt([
    {
      type: 'input',
      name: 'newRole',
      message: "What's your first name?"
    },
    {
      type: 'input',
      name: 'salary',
      message: "What's your last name?"
    },
    {
      type: 'input',
      name: 'id',
      message: "What's the role ID for this employee?"
    }
  ])
    .then(role => {
      let newRole = {
        title: role.newRole,
        salary: role.salary,
        department_id: role.id,
      }
      db.query('INSERT INTO employees SET ?', newRole, (err) => {
        if (err) { console.log(err) }
        console.log('The new role has been added!')
        start()
      })
    })
}

const viewDepartments = () => {
  db.query('SELECT * FROM departments', (err, data) => {
    if (err) { console.log(err)}
    console.table(data)
    start()
  })
}

const viewRoles = () => {
  db.query('SELECT * FROM roles', (err, data) => {
    if (err) { console.log(err) }
    console.table(data)
    start()
  })
}

const viewEmployees = () => {
  db.query(`
    SELECT employees.id, employees.first_name, employees.last_name, roles.title, roles.salary, departments.name AS 'department', CONCAT(manager.first_name, ' ', manager.last_name) AS manager
    FROM employees
    LEFT JOIN roles ON employees.role_id = roles.id
    LEFT JOIN departments ON roles.department_id = departments.id
    LEFT JOIN employees manager ON manager.id = employees.manager_id`, (err, employees) => {
    if (err) { console.log(err) }
    console.table(employees)
    start()
  })
}

const updateEmployee = () => {
  db.query(`SELECT * FROM employees
  LEFT JOIN roles ON employees.role_id = roles.id`,
    (err, data) => {
      if (err) { console.log(err) }
      prompt([
        {
          type: 'list',
          name: 'employees.id',
          message: 'Which employee would you like to update ?',
          choices: data.map(employee => ({
            name: `${employee.first_name} ${employee.last_name}`,
            value: employee.id
          }))
        },
        {
          type: 'list',
          name: 'newRole',
          message: 'Choose the new role for the employee',
          choices: data.map(role => ({
            name: `${role.title}`,
            value: role.id
          }))
        }
      ])
        .then(res => {
          db.query('UPDATE employees SET role_id = ? WHERE id = ?', [res.newRole, res.employees.id], err => {
            if (err) { console.log(err) }
            console.log('Role updated!')
            start()
          })
        })
        .catch(err => console.log(err))
    })
}

start()