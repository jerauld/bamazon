var mysql = require("mysql");
var Table = require('cli-table');
var inquirer = require("inquirer");
var colors = require('colors');
var header = require("./javascript_modules/header.js");
var itemIdArr = [];
var tableHead = [];
var table;

function newTable(tableHead){
  table = new Table({
      head: tableHead, 
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
  header.bamazonHeader(false, null);
  displayProducts("SELECT * FROM products");
});

function displayProducts(param) {
    tableHead = ['Item ID'.bold, 'Product Name'.bold, 'Price'.bold];
    newTable(tableHead);
    connection.query(param, function(err, res) {
      for (var i = 0; i < res.length; i++) {
        table.push([res[i].item_id, res[i].product_name, `$${res[i].price}`]);
        itemIdArr.push(res[i].item_id);
      }
    console.log(`\n${table.toString()}\n`);
    promptItemId(itemIdArr);
    });
}

function promptItemId(arr) {
  inquirer.prompt([{
      name: "item_id",
      type: "input",
      message: "Enter the ID of the product you would like to buy: ",
      validate: function(value){
        if(arr.includes(parseInt(value))){
          return true;
        }
        return "Enter a valid ID!";
      }
    }])
    .then(function(answer) {
      var query = `SELECT * FROM products WHERE item_id="${answer.item_id}"`
      connection.query(query, function (err, res) {
        promptItemQuantity(res);
      })
    });
}

function promptItemQuantity(id) {
  inquirer.prompt([{
    name: "product_quantity",
    type: "input",
    message: `Enter the quantity of ${id[0].product_name.cyan.bold} you would like: `,
    validate: function(value){
      if(!isNaN(value) && value > 0){
        return true;
      } else {
        return "Please enter a quantity."
      }
    }
  }])
  .then(function(answer) {
    if (answer.product_quantity > id[0].stock_quantity) {
      insufficientQuantity(answer.product_quantity, id, id[0].product_name, id[0].stock_quantity);
    } else {
      orderConfirm(answer.product_quantity, id, id[0].product_name, id[0].stock_quantity, id[0].price);
    }
  });
}

function insufficientQuantity(qty, id, product, stock) {
  inquirer.prompt([{
    name: "proceed_response",
    type: "rawlist",
    message: `Sorry. We have insufficient quantity available to fulfill the order of ${qty} ${product}.`.red + ` There are currently ${stock} ${product} in stock.`.green + `How would you like to proceed?`,
    choices: ["Re-enter the Quantity", "Select a Different Item", "Cancel Order Entirely"]
  }])
    .then(function(answer) {
      if (answer.proceed_response === 'Re-enter the Quantity'){
          promptItemQuantity(id);
      } else if (answer.proceed_response === 'Select a Different Item') {
        console.log(`\n${table.toString()}\n`);
        promptItemId(itemIdArr);
      } else {
        console.log(`\n Thank you for shopping with us. We look forward to being of service again soon!\n`.bold.yellow);
        connection.end();
      }
    });
}

function orderConfirm(qty, id, product, stock, price){
  var cost = qty * price;
  header.displayOrder("confirmation", "Order Summary", qty, product, price, cost)
  inquirer.prompt([{
    name: "confirm_response",
    type: "rawlist",
    message: `Review your order.`,
    choices: ["Place your order.", "Cancel your order."]
  }])
  .then(function(answer) {
    if (answer.confirm_response === `Place your order.`) {
      purchaseItem(qty, id, product, stock, price);
    } else {
      console.log(`\n Your order has been cancelled.\n`.bold.red);
      keepShopping();
    }
  });
}

function purchaseItem(qty, id, product, stock, price){
  var newStockQuantity =  stock - qty;
  var cost = qty * price;
  var query = `UPDATE products SET stock_quantity=${newStockQuantity} WHERE item_id=${id[0].item_id}`
  connection.query(query, function (err, res) {
    header.displayOrder("summary", "Thank You For Your Purchase", qty, product, null, cost)
    keepShopping();
  })
}

function keepShopping() {
  inquirer.prompt([{
      name: "continue_response",
      type: "rawlist",
      message: `Would you like to continue shopping?`,
      choices: ["Yes", "No"]
    }])
    .then(function(answer) {
      if (answer.continue_response === `Yes`) {
        console.log(`\n${table.toString()}\n`);
        promptItemId(itemIdArr);
      } else {
        console.log(`\n Thank you for shopping with us. We look forward to being of service again soon!\n`.bold.yellow);
        connection.end();
      }
    });
}