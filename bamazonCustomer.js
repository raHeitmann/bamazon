var inquirer = require("inquirer");
var mysql = require("mysql");

var connection = mysql.createConnection({
            host: "localhost",
            port: 3306,

            //username
            user: "root",
            
            //password
            password: "root",
            database: "bamazon_db"
        });

        connection.connect(function(err){
            if (err) throw err;
            console.log("connected as id " + connection.threadId);
            
            
            selectAll()
        //end of connection 
        });

var choices = [""];

function selectAll() {
connection.query("SELECT * FROM products", function(err, res){
    if (err) throw err;

    console.log("Items available: ")
    //displays items in database
    for (var i = 0; i < res.length; i++) {
        
        choices.push(res[i].product_name);
        
    }

    //end query

            inquirer.prompt([

                {
                type: "list",
                message: "Which item would you like to purchase?",
                choices: choices,
                name: "choice"
                }
            
            ]).then(function(user) {

                console.log(user.choice)
                var choice = user.choice

                    inquirer.prompt([

                    {
                    type: "input",
                    message: "How many would you like to purchase?",
                    name: "amount"
                    }
                
                ]).then(function(user) {

                    console.log(user.amount)
                    connection.query("SELECT * FROM products WHERE product_name = '"+choice+"' ", function(err, res){
                    if (err) throw err;
                    

                    var quantity = res[0].stock_quantity;
                    var price = res[0].price;
                    //checks if there is sufficient quantity of items....
                    if (user.amount > res[0].stock_quantity) console.log("Insufficient quantity!")

                    //... and updates the database with purchase if so
                    else{

                        quantity = quantity - user.amount;
                        price = price * user.amount;

                        console.log("that many "+choice.toLowerCase()+"s are available!")
                        console.log("your total will be $"+price)
                        connection.query("UPDATE products SET stock_quantity='"+quantity+"' WHERE product_name='"+choice+"';", function(err, res){
                        if (err) throw err;

                        console.log(quantity+" remain");
                       
                        });
                    }
                    
                    });
            
        //end of number question
        }).catch(function () {
        console.log("Promise Rejected");
        });
        
    //end of item question
    }).catch(function () {
     console.log("Promise Rejected");
    });
//end of original query
});

//end of selectAll function
}