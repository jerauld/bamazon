DROP DATABASE IF EXISTS bamazonDB;

CREATE DATABASE bamazonDB;

USE bamazonDB;

CREATE TABLE products (
    --    * item_id (unique id for each product)
    item_id INTEGER (11) AUTO_INCREMENT NOT NULL,
    --    * product_name (Name of product)
    product_name VARCHAR(45) NOT NULL,
    --    * department_name
    department_name VARCHAR(45) NOT NULL,
    --    * price (cost to customer)
    price DECIMAL(10,2) NOT NULL,
    --    * stock_quantity (how much of the product is available in stores)
    stock_quantity INTEGER(11) NOT NULL,
    PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Echo Dot 2nd Generation", "Electronics", 49.99, 35),
       ("Otium Wireless Bluetooth Sports Headphones", "Electronics", 23.99, 57),
       ("Greenies Pill Pockets Treats for Dogs", "Pets", 13.99, 95),
       ("AmazonBasics Pet Training Pads", "Pets", 17.99, 16),
       ("Instant Pot 7-in-1 Multi-Cooker", "Home", 99.95, 13),
       ("KRUPS F203 Electric Spice and Coffee Grinder", "Home", 18.19, 21),
       ("Spalding NBA Street Basketball", "Sports & Outdoors", 14.99, 275),
       ("Coleman Oversized Quad Chair with Cooler", "Sports & Outdoors", 17.95, 64),
       ("Hasbro Connect 4 Game", "Toys & Games", 8.77, 30),
       ("Intex Dinoland Inflatable Play Center", "Toys & Games", 39.98, 156);