var mySQL = require("./SQLModule.js");
async function prepareDB() {
    console.log("Preparing db...");
    try {
        await mySQL.CreateDB("128project");
    }
    catch (e) {
        console.log("Db already exists");
        return;
    }

    let con = mySQL.CreateConnection("128project");
    const queryAsync = (sql) => new Promise((resolve, reject) => {
        con.query(sql, (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
    await queryAsync(`CREATE TABLE users (
        id int NOT NULL AUTO_INCREMENT,
        email varchar(255) DEFAULT NULL,
        password VARCHAR(255),
        balance int DEFAULT 0,
        sessionId VARCHAR(255),
        f_Name VARCHAR(255),
        l_Name VARCHAR(255),
        PRIMARY KEY (id)
    );`);
    console.log("Table users created");

    await queryAsync(`
        CREATE TABLE boughtstuff (
            user_id INT,
            courseName VARCHAR(255),
            picture VARCHAR(255),
            duration VARCHAR(255),
            price INT,
            PRIMARY KEY (user_id,courseName),
            FOREIGN KEY (user_id) REFERENCES users(id)
        );
    `);
    console.log("Table boughtstuff created");

    await queryAsync(`
        CREATE TABLE basket (
            user_id INT,
            courseName VARCHAR(255),
            picture VARCHAR(255),
            duration VARCHAR(255),
            price INT,
            PRIMARY KEY (user_id,courseName),
            FOREIGN KEY (user_id) REFERENCES users(id)
        );
    `);
    console.log("Table basket created");
    con.end();
}

prepareDB();