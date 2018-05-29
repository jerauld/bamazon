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
      console.log("════════════════════════════════════════════════════════════════════════════════".yellow)
      console.log(" Qty: ".bold + qty.cyan.bold + " | ".yellow + "Product: ".bold + product.cyan.bold + " | ".yellow + "Price: ".bold + "$"+price);
      console.log("--------------------------------------------------------------------------------".yellow)
      console.log(" Order Total: ".bold.yellow + "$"+cost.toFixed(2) + "\n\n");
    } else if ( type === "summary") {
      console.log(`\n\n ${message}`.bold.green);
      console.log("════════════════════════════════════════════════════════════════════════════════".green)
      console.log(` You ordered "${product.cyan.bold}", Qty: ${qty}. ` + `Order total: `.green.bold + `${cost.toFixed(2)}\n\n`.bold);
    }
  }

}