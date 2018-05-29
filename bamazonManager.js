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
                displayProducts("SELECT * FROM products", false);
                break
            case 'View Low Inventory':
                displayProducts("SELECT * FROM products WHERE stock_quantity < 5", false);
                break
            case 'Add to Inventory':
                displayProducts("SELECT * FROM products", true);
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

function displayProducts(param, isAddingInventory) {
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
    if (isAddingInventory === true) {
      promptItemId(itemIdArr);
    } else {
      promptOptions();
    }
    });
}

function promptItemId(arr) {
    inquirer.prompt([{
        name: "item_id",
        type: "input",
        message: "Enter the ID of the product you would like to add inventory to: ",
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
          promptInventoryQuantity(res);
        })
      });
  }

  function promptInventoryQuantity(id) {
    inquirer.prompt([{
      name: "inventory_quantity",
      type: "input",
      message: `How much inventory would you like to add to the existing stock of ${id[0].product_name.cyan.bold}?`,
      validate: function(value){
        if(!isNaN(value) && value > 0){
          return true;
        } else {
          return "Please enter a quantity."
        }
      }
    }])
    .then(function(answer) {
        jobConfirm(answer.inventory_quantity, id, id[0].product_name, id[0].stock_quantity, id[0].price);
    });
  }


function jobConfirm(qty, id, product, stock, price){
  console.log(stock);
    var newQuantity = stock + parseInt(qty);
    var cost = price * qty;
    header.displayJob("confirmation", "Ready to Complete", qty, stock, product, price, newQuantity, cost)
    inquirer.prompt([{
      name: "confirm_response",
      type: "rawlist",
      message: `Are these changes correct?`,
      choices: ["Confirm and Proceed", "Cancel Job and Select A Different Product", "Return to Manager Options"]
    }])
    .then(function(answer) {
      if (answer.confirm_response === `Confirm and Proceed`) {
        // addStock(qty, id, product, stock, price);
      } else if (answer.confirm_response === `Cancel Job and Select A Different Product`) {
        console.log(`\n Your job has been cancelled.\n`.bold.red);
        displayProducts("SELECT * FROM products", true);
      } else {
        console.log(`\n Your job has been cancelled.\n`.bold.red);
        promptOptions();
      }
    });
  }

  // function addStock(qty, id, product, stock, price){
  //   var newStockQuantity =  stock + qty;
  //   var query = `UPDATE products SET stock_quantity=${newStockQuantity} WHERE item_id=${id[0].item_id}`
  //   connection.query(query, function (err, res) {
  //     header.displayReview("summary", "Thank You For Your Purchase", qty, product, null, cost)
  //     keepShopping();
  //   })
  // }

// function addToInventory(){
//     console.log('>>>>>>Adding to Inventory<<<<<<');
  
//     connection.query('SELECT * FROM Products', function(err, res){
//     if(err) throw err;
//     var itemArray = [];
//     //pushes each item into an itemArray
//     for(var i=0; i<res.length; i++){
//       itemArray.push(res[i].ProductName);
//     }
  
//     inquirer.prompt([{
//       type: "list",
//       name: "product",
//       choices: itemArray,
//       message: "Which item would you like to add inventory?"
//     }, {
//       type: "input",
//       name: "qty",
//       message: "How much would you like to add?",
//       validate: function(value){
//         if(isNaN(value) === false){return true;}
//         else{return false;}
//       }
//       }]).then(function(ans){
//         var currentQty;
//         for(var i=0; i<res.length; i++){
//           if(res[i].ProductName === ans.product){
//             currentQty = res[i].StockQuantity;
//           }
//         }
//         connection.query('UPDATE Products SET ? WHERE ?', [
//           {StockQuantity: currentQty + parseInt(ans.qty)},
//           {ProductName: ans.product}
//           ], function(err, res){
//             if(err) throw err;
//             console.log('The quantity was updated.');
//             start();
//           });
//         })
//     });