async function prepareDB(mySQL) {
    const dbExists = await new Promise((resolve, reject) => {
        let con = mySQL.CreateConnection();
        con.query("SHOW DATABASES LIKE '128project'", (err, result) => {
            console.log(result);
            if (err) return reject(err);
            resolve(result.length > 0);
        });
        con.end();
    });

    if (dbExists) {
        console.log("Database already exists. Skipping preparation.");
        return;
    }

    await mySQL.CreateDB("128project");

    
    const queryAsync = (sql) => new Promise((resolve, reject) => {
        let con = mySQL.CreateConnection("128project");
        con.query(sql, (err, result) => {  
            con.end();
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
        CREATE TABLE boughtStuff (
            user_id INT,
            courseName VARCHAR(255),
            picture VARCHAR(255),
            duration VARCHAR(255),
            price INT,
            PRIMARY KEY (user_id,courseName),
            FOREIGN KEY (user_id) REFERENCES users(id)
        );
    `);
    console.log("Table boughtStuff created");

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
}

module.exports = prepareDB;