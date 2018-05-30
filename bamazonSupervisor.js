var mysql = require("mysql");
var Table = require('cli-table');
var inquirer = require("inquirer");
var colors = require('colors');
var header = require("./javascript_modules/header.js");
var table;

function newTable(){
    table = new Table({
        head: ['Department ID'.bold, 'Department Name'.bold, 'Overhead Costs ($)'.bold, 'Product Sales ($)'.bold, 'Total Profit ($)'.bold], 
        style: {
        head:[], 
        border:[], 
        'padding-left': 1, 
        'padding-right': 1
        },
        chars: { 'top': '═' , 'top-mid': '╤' , 'top-left': '╔' , 'top-right': '╗'
            , 'bottom': '═' , 'bottom-mid': '╧' , 'bottom-left': '╚' , 'bottom-right': '╝'
            , 'left': '║' , 'left-mid': '╟' , 'mid': '─' , 'mid-mid': '┼'
            , 'right': '║' , 'right-mid': '╢' , 'middle': '│' }
    });
}

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "bamazonDB"
});

connection.connect(function(err) {
  if (err) throw err;
  header.bamazonHeader(true, "supervisor");
  promptOptions();
});

function promptOptions() {
    inquirer.prompt([{
        type: 'list',
        name: 'choice_selection',
        message: 'Select an option:',
        choices: ['View Product Sales By Department', 'Create New Department', 'Quit']
    }])
    .then(answer => {
        console.log(answer.choice_selection)
        switch (answer.choice_selection) {
            case 'View Product Sales By Department':
                header.tableHeader("Product Sales By Department");
                displayDepartments("SELECT d.department_id, d.department_name, d.over_head_costs, SUM(IFNULL(p.product_sales, 0)) AS 'product_sales', (SUM(IFNULL(p.product_sales, 0)) - d.over_head_costs) AS 'total_profit' FROM products p RIGHT JOIN departments d ON p.department_name = d.department_name GROUP BY d.department_id;");
                break
            case 'Create New Department':
                addPrompt();
                break
            case 'Quit':
                console.log(`\n You are now logged out.\n`.bold.red);
                connection.end();
                break
        }
    })
}

function displayDepartments(param) {
    newTable();
    connection.query(param, function(err, res) {
      if(err) throw err;
      for (var i = 0; i < res.length; i++) {
        // var departmentId = res[i].department_id;
        // var departmentName = res[i].department_name;
        // var overheadCosts = res[i].over_head_costs;
        // var productSales = res[i].product_sales;
        // var totalProfit = res[i].total_profit;
        table.push([res[i].department_id, res[i].department_name, res[i].over_head_costs, res[i].product_sales, res[i].total_profit]);
      }
    console.log(`\n${table.toString()}\n\n`);
    promptOptions();
    });
}

function addPrompt(){

    inquirer.prompt([{
        type: 'input',
        name: 'department_name',
        message: 'Enter a name for new department.',
        validate: function(value) {
            if (value !== '') {
                return true
            }
            return 'Please enter a name for new department.'
        }
    },
    {
        type: 'input',
        name: 'over_head_costs',
        message: 'Enter the overhead cost for new department.',
        validate: function(value) {
            if(!isNaN(value) && value > 0){
                return true;
            }
            return "Please enter the overhead cost for new department."
            
        }
    }])
    .then(function (answers) {
      addConfirm(answers);
    })
  
  }
  
  function addConfirm(res) {
    header.displayCreate("confirmation", "Ready to Complete", res.department_name, res.over_head_costs);
    inquirer.prompt([{
      name: "confirm_response",
      type: "list",
      message: `Are these values correct?`,
      choices: ["Confirm and Proceed", "Cancel Job and Add A Different Department", "Return to Supervisor Options"]
    }])
    .then(function(answer) {
      if (answer.confirm_response === `Confirm and Proceed`) {
        addDepartment(res.department_name, res.over_head_costs);
      } else if (answer.confirm_response === `Cancel Job and Add A Different Department`) {
        console.log(`\n Your job has been cancelled.\n`.bold.red);
        addPrompt();
      } else {
        console.log(`\n Your job has been cancelled.\n`.bold.red);
        promptOptions();
      }
    });
  }
  
  function addDepartment(departmentName, overheadCosts){
      console.log(departmentName);
    var query = `INSERT INTO departments (department_name, over_head_costs) VALUES ("${departmentName}", ${overheadCosts})`
    connection.query(query, function (err, res) {
      if(err) throw err;
      header.displayCreate("summary", "Job Completion", departmentName, overheadCosts)
      displayDepartments(`SELECT d.department_id, d.department_name, d.over_head_costs, SUM(IFNULL(p.product_sales, 0)) AS 'product_sales', (SUM(IFNULL(p.product_sales, 0)) - d.over_head_costs) AS 'total_profit' FROM products p RIGHT JOIN departments d ON p.department_name = d.department_name WHERE d.department_name="${departmentName}" GROUP BY d.department_id;`);
    })
  }

