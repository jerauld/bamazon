module.exports = {
  
  bamazonHeader: function(isMgmt, priv) {
    console.log(`
                                                                    
    ██████   █████  ███    ███  █████  ███████  ██████  ███    ██   
    ██   ██ ██   ██ ████  ████ ██   ██    ███  ██    ██ ████   ██   
    ██████  ███████ ██ ████ ██ ███████   ███   ██    ██ ██ ██  ██   
    ██   ██ ██   ██ ██  ██  ██ ██   ██  ███    ██    ██ ██  ██ ██   
    ██████  ██   ██ ██      ██ ██   ██ ███████  ██████  ██   ████   `);
    console.log(`               ------------------------->`.yellow.bold);
    if (isMgmt === true) {
      console.log(`                 LOGGED IN AS ${priv.toUpperCase()}\n`.red.bold);
    }
  },
  
  displayReview: function(type, message, qty, product, price, cost) {
    if (type === "confirmation") {
      console.log(`\n\n ${message}`.bold.yellow);
      console.log("════════════════════════════════════════════════════════════════════════════════════════".yellow)
      console.log(" Qty: ".bold + qty.cyan.bold + " | ".yellow + "Product: ".bold + product.cyan.bold + " | ".yellow + "Price: ".bold + "$"+price);
      console.log("----------------------------------------------------------------------------------------".yellow)
      console.log(" Order Total: ".bold.yellow + "$"+cost.toFixed(2) + "\n\n");
    } else if ( type === "summary") {
      console.log(`\n\n ${message}`.bold.green);
      console.log("════════════════════════════════════════════════════════════════════════════════════════".green)
      console.log(` You ordered "${product.cyan.bold}", Qty: ${qty}. ` + `Order total: `.green.bold + `${cost.toFixed(2)}\n\n`.bold);
    }
  },

  displayJob: function(type, message, stock, product, price, newQty, cost) {
    if (type === "confirmation") {
      console.log(`\n\n ${message}`.bold.yellow);
      console.log("════════════════════════════════════════════════════════════════════════════════════════".yellow)
      console.log(" Qty: ".bold + stock + " --> ".yellow.bold + newQty + " | ".yellow + "Product: ".bold + product.cyan.bold + " | ".yellow + "Price: ".bold + "$"+price);
      console.log("----------------------------------------------------------------------------------------".yellow)
      console.log(" Cost Total: ".bold.yellow + "$"+cost.toFixed(2) + "\n\n");
    } else if ( type === "summary") {
      console.log(`\n\n ${message}`.bold.green);
      console.log("════════════════════════════════════════════════════════════════════════════════════════".green)
      console.log(" The inventory of " + product.cyan.bold + " was changed from " + stock + " to " + newQty + ".");
      console.log("----------------------------------------------------------------------------------------".green)
      console.log(" Status: ".bold.green + "Success!");
    }
  },

  displayAdd: function(type, message, product, department, price, quantity) {
    if (type === "confirmation") { //Ready to Complete
      console.log(`\n\n ${message}`.bold.yellow);
      console.log("════════════════════════════════════════════════════════════════════════════════════════".yellow)
      console.log(" The following product will be added to inventory:".bold + "\n");
      console.log(" Product Name:".bold.cyan + product);
      console.log(" Department Name:".bold.cyan + department);
      console.log(" Price:".bold.cyan + price);
      console.log(" Product Name:".bold.cyan + quantity + "\n");
      console.log("----------------------------------------------------------------------------------------\n\n".yellow)
    } else if ( type === "summary") {
      console.log(`\n\n ${message}`.bold.green); //Job Compleition
      console.log("════════════════════════════════════════════════════════════════════════════════════════".green)
      console.log(" " + product.cyan.bold + " was added to the inventory");
      console.log("----------------------------------------------------------------------------------------".green)
      console.log(" Status: ".bold.green + "Success!");
    }
  }

}