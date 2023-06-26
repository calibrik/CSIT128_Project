var myMySQL = require("./SQLModule.js");

let con = myMySQL.CreateConnection("128project");

con.query(`CREATE TABLE users (
  id int NOT NULL AUTO_INCREMENT,
  email varchar(255) DEFAULT NULL,
  password VARCHAR(255),
  balance int DEFAULT 0,
  sessionId VARCHAR(255),
  f_Name VARCHAR(255),
  l_Name VARCHAR(255),
  PRIMARY KEY (id)
); `, (err, result) => {
    if (err) throw err;
    console.log("Table created");
});
/*con.query('INSERT INTO users (email,password, f_Name, l_Name) VALUES ("Ihate@claps.com","12345", "Bur", "Nedhands")',
    (err, result) => {
    if (err) throw err;
    console.log("Line inserted");
    });*/
con.query(`
    CREATE TABLE boughtStuff (
    user_id INT,
    courseName VARCHAR(255),
    picture VARCHAR(255),
    duration VARCHAR(255),
    price INT,
    PRIMARY KEY (user_id,courseName),
    FOREIGN KEY (user_id) REFERENCES Users(id)
);`, (err, result) => {
    if (err) throw err;
    console.log("Table created");
});
con.query(`
    CREATE TABLE basket (
    user_id INT,
    courseName VARCHAR(255),
    picture VARCHAR(255),
    duration VARCHAR(255),
    price INT,
    PRIMARY KEY (user_id,courseName),
    FOREIGN KEY (user_id) REFERENCES Users(id)
);`, (err, result) => {
    if (err) throw err;
    console.log("Table created");
});
con.end();
