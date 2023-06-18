var mysql = require('mysql2');
var HOST = "localhost";
var USER = "root";
var PASSWORD = "admin";


function CreateDB(name) {
    let con = mysql.createConnection({
        host: HOST,
        user: USER,
        password: PASSWORD
    });
    con.query(`CREATE DATABASE ${name}`, (err, result) => {
        if (err) throw err;
        console.log(`Database ${name} created`);
    });
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
