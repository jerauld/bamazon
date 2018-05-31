# bamazon

**Overview**

Bamazon was created for the Node.js & MySQL homework assignment for Berkeley Coding Bootcamp. Bamazon is an Amazon-like storefront that takes in orders from customers and deplete tock from the store's inventory. It also tracks product sales across departments and provides a summary of the highest-grossing departments.

**Deployment Requirements**

`npm i` will install the following:

-npm install mysqlbma
-npm install cli-table
-npm install inquirer
-npm install colors

**Walking Through Video**
(Soon)

**Gifs**

<img src="https://github.com/jerauld/bamazon/blob/master/images/bamazonCustomerJS.gif?raw=true" width="600px" text-align="center"/>
<img src="https://github.com/jerauld/bamazon/blob/master/images/bamazonManagerJS.gif?raw=true" width="600px" text-align="center"/>
<img src="https://github.com/jerauld/bamazon/blob/master/images/bamazonSupervisorJS.gif?raw=true" width="600px" text-align="center"/>

**Requirements**

- The completed app should utilize a MySql Database called `bamazon`.
- The `products` table should have each of the following columns,       populated with around 10 different products:
    * item_id (unique id for each product)
    * product_name (Name of product)
    * department_name
    * price (cost to customer)
    * stock_quantity (how much of the product is available in stores)
- The `bamazonCustomer.js` Node application will:
    - First display all of the items available for sale including the ids, anme, and prices for products for sale.
    - The app should then prompt users with two messages.
        * The first should ask them the ID of the product they would like to buy.
        * The second message should ask how many units of the product they would like to buy.
    - The application should check if the store has enough of the product to meet the customer's request once the customer has placed the order. If not, the app should log a phrase like `Insufficient quantity`, and then prevent the order from going through.
    - If the store _does_ have enough of the product, the aplication will fulfill the customer's order, meaning updating the SQL database to reflect the remaining quantity and showing the customer the total cost of their purchase.
- The `bamazonManager.js` will:
    - List a set of menu options:
        * View Products for Sale
            - Lists every available item: the item IDs, names, prices, and quantities.
        * View Low Inventory
            - Lists all items with an inventory count lower than five.
        * Add to Inventory
            - Displays a prompt that will let the manager "add more" of any item currently in the store.
        * Add New Product
            - Allow the manager to add a completely new product to the store.
- The `bamazonSupervisor.js` will:
    - List a set of menu options:
        * View Product Sales by Department
            - Displays a sumarized table in the terminal/bash
        * Create New Department
    -  Requires a new MySQL table called `departments`, which should include the following columns:
         * department_id
         * department_name
         * over_head_costs (A dummy number you set for each department)
    -   Requires a `products` table so that there's a product_sales column and modify the `bamazonCustomer.js` app so that this value is updated with each individual products total revenue from each sale.

    **Note: I utilized `ALTER TABLE` as follows:**

        ```Javascript
            ALTER TABLE products
                ADD COLUMN product_sales DECIMAL(10, 2) DEFAULT 0 AFTER stock_quantity;
        ```
    -   Require modifying the `bamazonCustomer.js` app so that when a customer purchases anything from the store, the price of the product multiplied by the quantity purchased is added to the product's product_sales column, making sure the app still updates the inentory listed in the `products` column.