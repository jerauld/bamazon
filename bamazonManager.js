var mysql = require("mysql");
var Table = require('cli-table');
var inquirer = require("inquirer");
var colors = require('colors');
var header = require("./javascript_modules/header.js");
var itemIdArr = [];
var table;

function newTable(){
    table = new Table({
        head: ['Item ID'.bold, 'Product Name'.bold, 'Department Name'.bold, 'Price'.bold, 'Stock Quantity'.bold], 
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
  header.bamazonHeader(true, "manager");
  promptOptions();
});

function promptOptions() {
    inquirer.prompt([{
        type: 'list',
        name: 'choice_selection',
        message: 'Select an option:',
        choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product', 'Quit']
    }])
    .then(answer => {
        console.log(answer.choice_selection)
        switch (answer.choice_selection) {
            case 'View Products for Sale':
                displayProducts("SELECT * FROM products");
                break
            case 'View Low Inventory':
                displayProducts("SELECT * FROM products WHERE stock_quantity < 5");
                break
            case 'Add to Inventory':
                console.log('Add to Inventory');
                break
            case 'Add New Product':
                console.log('View Products for Sale');
                break
            case 'Quit':
                connection.end();
                break
        }
    })
}

function displayProducts(param) {
    newTable();
    connection.query(param, function(err, res) {
      for (var i = 0; i < res.length; i++) {
        var itemId = res[i].item_id;
        var productName = res[i].product_name;
        var departmentName = res[i].department_name;
        var price = res[i].price;
        var stockQuantity = res[i].stock_quantity;
        table.push([itemId, productName, departmentName, `$${price}`, stockQuantity]);
        itemIdArr.push(itemId);
      }
    console.log(`\n${table.toString()}\n`);
    promptOptions();
    });
}