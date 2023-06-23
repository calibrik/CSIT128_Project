var myMySQL = require("./SQLModule.js");

let con = myMySQL.CreateConnection("128project");

con.query(`CREATE TABLE users (
  id int NOT NULL AUTO_INCREMENT,
  name varchar(255) DEFAULT NULL,
  email varchar(255) DEFAULT NULL,
  password VARCHAR(255),
  age int DEFAULT NULL,
  balance int DEFAULT NULL,
  sessionId VARCHAR(255),
  expirationTime INT,
  PRIMARY KEY (id)
); `, (err, result) => {
    if (err) throw err;
    console.log("Table created");
});
con.query('INSERT INTO users (name, email,password, age, balance) VALUES ("admin", "Ihate@claps.com","12345", 99, 5000)',
    (err, result) => {
    if (err) throw err;
    console.log("Line inserted");
    });
con.query('INSERT INTO users (name, email,password, age, balance) VALUES ("user1", "test@gmail.com","54321usr", 10, 5000)',
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
