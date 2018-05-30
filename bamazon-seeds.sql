USE bamazonDB;

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Echo Dot 2nd Generation", "Electronics", 49.99, 35),
       ("Otium Wireless Bluetooth Sports Headphones", "Electronics", 23.99, 57),
       ("Greenies Pill Pockets Treats for Dogs", "Pets", 13.99, 95),
       ("BamazonBasics Pet Training Pads", "Pets", 17.99, 16),
       ("Instant Pot 7-in-1 Multi-Cooker", "Home", 99.95, 13),
       ("KRUPS F203 Electric Spice and Coffee Grinder", "Home", 18.19, 21),
       ("Spalding NBA Street Basketball", "Sports & Outdoors", 14.99, 275),
       ("Coleman Oversized Quad Chair with Cooler", "Sports & Outdoors", 17.95, 64),
       ("Hasbro Connect 4 Game", "Toys & Games", 8.77, 30),
       ("Intex Dinoland Inflatable Play Center", "Toys & Games", 39.98, 156),
       ("SENSO Bluetooth Headphones", "Electronics", 19.47, 10),
       ("American Classic Mallard Dog Toy", "Pets", 17.72, 3),
       ("Lodge 10-1/4-Inch Cast Iron Skillet", "Home", 14.88, 1),
       ("Wilson Hyper Hammer 5.3 Tennis Racket", "Sports & Outdoors", 89.00, 4),
       ("Rubik's Cube 4x4", "Toys & Games", 20.48, 6);

INSERT INTO departments (department_name, over_head_costs)
VALUES ("Electronics", 6000),
       ("Pets", 4000),
       ("Home", 5000),
       ("Sports & Outdoors", 6000),
       ("Toys & Games", 4000);