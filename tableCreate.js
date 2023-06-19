var myMySQL = require("./SQLModule.js");

let con = myMySQL.CreateConnection("128project");

con.query(`CREATE TABLE users (
  id int NOT NULL AUTO_INCREMENT,
  name varchar(255) DEFAULT NULL,
  email varchar(255) DEFAULT NULL,
  age int DEFAULT NULL,
  balance int DEFAULT NULL,
  PRIMARY KEY (id)
); `, (err, result) => {
    if (err) throw err;
    console.log("Table created");
});
con.query('INSERT INTO users (id, name, email, age, balance) VALUES (1, "admin", "likekids@nig.com", 99, 5000)',
    (err, result) => {
    if (err) throw err;
    console.log("Line inserted");
});
con.query(`
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
});
con.query(`
    CREATE TABLE basket (
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
});
con.end();
