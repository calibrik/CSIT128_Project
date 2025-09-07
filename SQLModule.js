var mysql = require('mysql2');
var HOST = "mysql";
var USER = "root";
var PASSWORD = "admin";


async function CreateDB(name) {
    const con = mysql.createConnection({
        host: HOST,
        user: USER,
        password: PASSWORD
    });

    const query = (sql) => new Promise((resolve, reject) => {
        con.query(sql, (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });

    try {
        await query(`CREATE DATABASE ${name}`);
        console.log(`Database ${name} created`);
    } catch (err) {
        con.end();
        throw err;
    }
    con.end();
}

function CreateConnection(db) {
    return mysql.createConnection({
        host: HOST,
        user: USER,
        password: PASSWORD,
        database: db
    });
}
module.exports = {
    CreateDB,
    CreateConnection
};
