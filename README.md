# bamazon

**Overview**

Bamazon was created for the Node.js & MySQL homework assignment for Berkeley Coding Bootcamp. Bamazon is an Amazon-like storefront that takes in orders from customers and deplete tock from the store's inventory. It also tracks product sales across departments and provides a summary of the highest-grossing departments.

**Deployment Requirements**

`npm i` will install the following:

* npm install mysqlbma
* npm install cli-table
* npm install inquirer
* npm install colors

- Run bamazon-schema.sql
- Run bamazon-seeds.sql

You can populate product_sales with the following:

```
UPDATE products SET product_sales=<value> WHERE item_id=<item_id>;
```

**Bamazon (MySQL/Node.JS) App Walkthrough (YouTube)**

[![Bamazon App YouTube Walkthrough](https://github.com/jerauld/bamazon/blob/master/images/bamazonWalkthroughYT.png?raw=true)](https://youtu.be/yqo6C9uex50)

**App Demo GIFs**

_Bamazon Customer JS_

<img src="https://github.com/jerauld/bamazon/blob/master/images/bamazonCustomerJS.gif?raw=true" width="600px"/>

_Bamazon Manager JS_

<img src="https://github.com/jerauld/bamazon/blob/master/images/bamazonManagerJS.gif?raw=true" width="600px"/>

_Bamazon Supervisor JS_

<img src="https://github.com/jerauld/bamazon/blob/master/images/bamazonSupervisorJS.gif?raw=true" width="600px"/>

**Requirements**

- The completed app should utilize a MySQL Database called `bamazon`, consisting of two tables:
    - The `products` table should have each of the following columns, populated with around 10 different products:
        * item_id (unique id for each product)
        * product_name (Name of product)
        * department_name
        * price (cost to customer)
        * stock_quantity (how much of the product is available in stores)
    - The `departments` table should have each of the following columns:
        * department_id
        * department_name
        * over_head_costs (A dummy number you set for each department)

    **Note:** The `bamazonSupervisor.js` app requires that the `products` table be modified to add a product_sales column. I utilized `ALTER TABLE` as follows:

    ```Javascript
        ALTER TABLE products
            ADD COLUMN product_sales DECIMAL(10, 2) DEFAULT 0 AFTER stock_quantity;
    ```

    The `bamazonSupervisor.js` app also requires that the `total_profit` column on the `departments` table should be calculated on the fly using the difference between `over_head_costs` and `product_sales`. `total_profit` should not be stored in any database, and should utilize a customer alias. I achieved this as follows:

    ```Javascript
        SELECT
            d.department_id,
            d.department_name,
            d.over_head_costs,
            SUM(IFNULL(p.product_sales, 0)) AS 'product_sales',
            (SUM(IFNULL(p.product_sales, 0)) - d.over_head_costs) AS 'total_profit'
        FROM products p
        RIGHT JOIN departments d ON p.department_name = d.department_name
        GROUP BY d.department_id;
    ```


- The `bamazonCustomer.js` Node application will display all of the items available for sale including the ids, name, and prices for products for sale, prompting users with two messages. The first asking them the ID of the product they would like to buy. The second message asking them how many units of the product they would like to buy. The app checks if the store has enough of the product to meet customer's request once order has been placed. If not the app will log a phrase like `Insufficient quantity` and then prevent the order from going through. If the store _does_ have enough of the product, the application will fulfill the customer's order, updating the SQL database to reflect the remaining quantity and showing the customer the total cost of their purchase.

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
 