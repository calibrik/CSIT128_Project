var myMySQL = require("./SQLModule.js");

let con = myMySQL.CreateConnection("128project");
con.query("DELETE FROM boughtstuff", (err, result) => {
    if (err) throw err;
});
con.end();
/*con.query(`
    CREATE TABLE boughtStuff (
    user_id INT,
    courseName VARCHAR(255),
    picture VARCHAR(255),
    duration VARCHAR(255),
    price INT,
    PRIMARY KEY (courseName),
    FOREIGN KEY (user_id) REFERENCES Users(id)
);`, (err, result) => {
    if (err) throw err;
    console.log("Table created");
});*/