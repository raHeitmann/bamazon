    //TODO TODO TODO TODO

// Add New Product

// If a manager selects Add New Product, it should allow the 
// manager to add a completely new product to the store.

var inquirer = require('inquirer');
var mysql = require('mysql');

var items = [""]; // for add to inventory


var connection = mysql.createConnection({

            host: 'localhost',
            port: 3306,

            user: 'root',
            password: 'root',
            database: 'bamazon_db'

});

connection.connect(function(err){
    if (err) throw err;
    console.log("connected as id " + connection.threadId);

//TODO : CHOOSE FUNCTION
addToInventory();

});

function viewProducts() {

    connection.query("SELECT * FROM products", function(err, res){
        if (err) throw err;

        //cycles through all items in stock
        //and prints them
        console.log("ITEMS AVAILABLE:")
        for (var i = 0; i < res.length; i++){
  //item_id, product_name, department_name, price, stock_quantity
            console.log(res[i].item_id
                +   " "+res[i].product_name
                +   " ["+res[i].department_name
                +   "] $"+res[i].price
                +   " ("+res[i].stock_quantity+" available)");

        }
    //END OF QUERY
    });
//END OF VIEW PRODUCTS FUNCTION
}

function viewLowInventory() {

    connection.query("SELECT * FROM products WHERE stock_quantity < 5", function(err, res){
        if (err) throw err;

        //cycles through all items in stock
        //and prints them
        console.log("ITEMS LOW IN STOCK:")
        for (var i = 0; i < res.length; i++){
  //item_id, product_name, department_name, price, stock_quantity
            console.log(res[i].item_id
                +   " "+res[i].product_name
                +   " ["+res[i].department_name
                +   "] $"+res[i].price
                +   " ("+res[i].stock_quantity+" available)");

        }
    //END OF QUERY
    });
//END OF VIEW LOW FUNCTION
}

function addToInventory() {

    connection.query("SELECT * FROM products", function(err, res){
        if (err) throw (err)

         for (var i = 0; i < res.length; i++){
  //item_id, product_name, department_name, price, stock_quantity
            items.push(res[i].product_name);
        }

        inquirer.prompt([
            {
                type:"list",
                message: "Which item would you like to increase in inventory?",
                choices: items,
                name: "choice"
            }
        ]).then(function(user){
            //QUERY'S MANAGER CHOICE
            connection.query("SELECT * FROM products WHERE product_name = '"+user.choice+"'", function(err, res){
                if (err) throw (err)
                console.log("There are currently "+res[0].stock_quantity+" of this product in stock");
                var current = res[0];
                var quantity = parseInt(res[0].stock_quantity);
                var theItem = user.choice;
                inquirer.prompt([
                    {
                        type:"input",
                        message: "How many would you like to add?",
                        name: "amount"
                    }
                ]).then(function(user){

                    quantity = quantity+parseInt(user.amount);
                    connection.query("UPDATE products SET stock_quantity='"+quantity+"' WHERE product_name='"+theItem+"'", function(err, res){
                        if (err) throw err;
                        console.log("There are now "+quantity+" available");
                    //END OF ADDING QUERY 
                    });
                }).catch(function(){
                    console.log("Promise Rejected no way");
                //END OF AMOUNT PROMPT
                });
            //END OF SPECIFIC QUERY
            });
        }).catch(function(){
            console.log("Promise Rejected heeya");
        //END OF FIRST PROMPT
        });

    //END OF INTITIAL SELECT ALL QUERY
    });
//END OF ADD TO INV FUNCTION
}