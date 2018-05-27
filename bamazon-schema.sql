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