var mysql = require("mysql");
var Table = require('cli-table');
var inquirer = require("inquirer");
var itemIdArr = [];

var table = new Table({
    head: ['Item ID', 'Product Name', 'Price'], 
    style: {
      head:[], 
      border:[], 
      'padding-left': 1, 
      'padding-right': 1
    }
  });

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "bamazonDB"
});

connection.connect(function(err) {
  if (err) throw err;
  displayProducts();
});

function displayProducts() {
    var query = "SELECT * FROM products";
    connection.query(query, function(err, res) {
      for (var i = 0; i < res.length; i++) {
        var itemId = res[i].item_id;
        var productName = res[i].product_name;
        var departmentName = res[i].department_name;
        var price = res[i].price;
        var stockQuantity = res[i].stock_quantity;
        table.push([itemId, productName, price]);
        itemIdArr.push(itemId);
      }
    console.log(`\n${table.toString()}\n`);
    promptItemId(itemIdArr);
    });
}

function promptItemId(arr) {
  var itemIdArr = arr;
  inquirer.prompt([{
      name: "item_id",
      type: "input",
      message: "Enter the ID of the product you would like to buy: ",
      validate: function(value){
        if(itemIdArr.includes(parseInt(value))){
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

function promptItemQuantity(idRes) {
  var productName = idRes[0].product_name;
  var price = idRes[0].price;
  var stockQuantity = idRes[0].stock_quantity;
  var itemId = idRes;
  inquirer.prompt([{
    name: "product_quantity",
    type: "input",
    message: `Enter the quantity of ${productName} you would like: `,
    validate: function(value){
      if(!isNaN(value) && value > 0){
        return true;
      } else {
        return "Please enter a quantity."
      }
    }
  }])
  .then(function(answer) {
    var qtyRes = answer.product_quantity;
    if (qtyRes > stockQuantity) {
      insufficientQuantity(qtyRes, itemId, productName, stockQuantity);
    } else {
      orderConfirm(qtyRes, itemId, productName, stockQuantity, price);
    }
  });
}

function insufficientQuantity(qtyRes, idRes, product, stock) {
  var productQuantity = qtyRes;
  var itemId = idRes;
  var productName = product;
  var stockQuantity = stock;
  inquirer.prompt([{
    name: "proceed_response",
    type: "rawlist",
    message: `Sorry. We have insufficient quantity available to fulfill the order of ${productQuantity} ${productName}. There are currently ${stockQuantity} ${productName} in stock. How would you like to proceed?`,
    choices: ["Re-enter the Quantity", "Select a Different Item", "Cancel Order Entirely"]
  }])
    .then(function(answer) {
      var response = answer.proceed_response;
      if (response === 'Re-enter the Quantity'){
          promptItemQuantity(itemId);
      } else if (response === 'Select a Different Item') {
        console.log(`\n${table.toString()}\n`);
        promptItemId(itemIdArr);
      } else {
        console.log(`\nThank you for shopping with us. We look forward to being of service again soon!\n`);
        connection.end();
      }
    });
}

function orderConfirm(qtyRes, idRes, product, stock, price){
  var productName = idRes[0].product_name;
  var price = idRes[0].price;
  var stockQuantity = idRes[0].stock_quantity;
  var itemId = idRes;
  var cost = qtyRes * price;
  console.log(`\nOrder Summary: Item:"${productName}", Qty: ${qtyRes}. Order total: ${cost}\n`);
  inquirer.prompt([{
    name: "confirm_response",
    type: "rawlist",
    message: `Review your order.`,
    choices: ["Place your order.", "Cancel your order."]
  }])
  .then(function(answer) {
    if (answer.confirm_response === `Place your order.`) {
      purchaseItem(qtyRes, itemId, productName, stockQuantity, price);
    } else {
      console.log(`\nYour order has been cancelled.\n`);
      keepShopping();
    }
  });
}

function purchaseItem(qtyRes, idRes, product, stock, price){
  var newStockQuantity =  stock - qtyRes;
  var cost = qtyRes * price;
  var productName = product;
  var itemId = idRes[0].item_id;
  var query = `UPDATE products SET stock_quantity=${newStockQuantity} WHERE item_id=${itemId}`
  connection.query(query, function (err, res) {
    console.log(`\nThank you for your purchase. You ordered "${productName}". Order total: ${cost}\n`);
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
        console.log(`\nThank you for shopping with us. We look forward to being of service again soon!\n`);
        connection.end();
      }
    });
}