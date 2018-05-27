var mysql = require("mysql");
var Table = require('cli-table');
var inquirer = require("inquirer");

var table = new Table({
    head: ['item_id', 'product_name', 'department_name', 'price', 'stock_quantity'], 
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
    var itemIdArr = [];
    var query = "SELECT * FROM products";
    connection.query(query, function(err, res) {
      for (var i = 0; i < res.length; i++) {
        table.push([res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]);
        itemIdArr.push(res[i].item_id);
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
  var departmentName = idRes[0].department_name;
  var price = idRes[0].price;
  var stockQuantity = idRes[0].stock_quantity;
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
  console.log(answer);
  });
}