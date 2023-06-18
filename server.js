'use strict';
var http = require('http');
var port = process.env.PORT || 8080;
var url = require("url");
var myMySQL = require("./SQLModule.js");
var formidable = require("formidable");
var fs = require("fs");
var possibleCoursesURLs = ["/LawCourses", "/ProgrammingCourses"];
var extensionsToType = { "html": "text/html", "css": "text/css", "js": "text/javascript", "json":"application/json", "png":"image/png" };




function goTo(url, res) {
    let ext = url.split(".")[1];
    fs.readFile(`data/${ext}/${url}`, (err, data) => {
        if (err) {
            console.log(`${url} not found`);
            res.writeHead(404, { "Content-Type": "text/html" });
            return res.end("404 NOT FOUND");
        }
        res.writeHead(200, { "Content-Type": extensionsToType[ext] });
        res.write(data);
        return res.end();
    });
}




function loadCoursesPages(res, req) {
    fs.readFile("data/html/Template for courses.html", (err, data) => {
        if (err) {
            console.log("Template not found");
            res.writeHead(404, { "Content-Type": "text/html" });
            return res.end("404 NOT FOUND");
        }
        let newData = data.toString().replace("INSERT_FILE_NAME", `"${`${req.url.slice(1)}.json`}"`);
        res.writeHead(200, { "Content-Type": "text/html" });
        res.write(newData);
        return res.end();
    });
}




function addToBasket(res, req) {
    var form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files) => {
        if (err) {
            console.log("Form error");
            res.statusCode = 500;
            return res.end();
        }
        fs.readFile(`data/json/${fields["fileName"]}`, (err, data) => {
            if (err) {
                console.log(`JSON error ${fields["fileName"]}`);
                res.statusCode = 500;
                return res.end();
            }
            let listCourses = JSON.parse(data).courses;
            let con = myMySQL.CreateConnection("128project");
            let keys = Object.keys(fields);
            keys.splice(keys.indexOf("filename"));
            for (let i = 0; i < keys.length - 1; ++i) {
                con.query(`INSERT INTO basket (user_id,courseName,picture,duration,price) VALUES (1,"${keys[i]}","${listCourses[keys[i]].picture}","${listCourses[keys[i]].duration}",${listCourses[keys[i]].price});`,
                    (err, result) => {
                        if (err && err.errno == 1062) {
                            console.log(`${keys[i]} already in basket`);
                            return;
                        }
                        console.log(`Added ${keys[i]} to basket`);
                    });
            }
            con.query(`INSERT INTO basket (user_id,courseName,picture,duration,price) VALUES (1,"${keys[keys.length - 1]}","${listCourses[keys[keys.length - 1]].picture}","${listCourses[keys[keys.length - 1]].duration}",${listCourses[keys[keys.length - 1]].price});`,
                (err, result) => {
                    if (err && err.errno == 1062) {
                        console.log(`${keys[keys.length - 1]} already in basket`);
                    }
                    else console.log(`Added ${keys[keys.length - 1]} to basket`);
                    res.writeHead(302, { "Location": "/basket" });
                    return res.end();
                });
            con.end();
        });
    });
}




function loadBasket(res) {
    fs.readFile("data/html/basketPage.html", (err, data) => {
        if (err) {
            console.log(`basketPage.html error`);
            res.statusCode = 500;
            return res.end();
        }

        data = data.toString();
        let con = myMySQL.CreateConnection("128project");
        con.query("SELECT * FROM basket", (err, results) => {
            if (err) throw err;
            let total = 0;
            let text = ``;
            for (let result of results) {
                text += `
                <div class="course-card">
                    <img class="course-card-image" src="${result.picture}" alt="AI course">
                    <h3 class="course-card-title">${result.courseName}</h3>
                    <h6>${result.duration}</h6>
                    <p class="course-card-price">${result.price} AED</p>
                </div>`
                total += result.price;
            }
            data += `<script>
                document.getElementById("toFill").innerHTML = \`${text}\`;
                document.getElementById("total").innerHTML = "Total: ${total} AED";
                document.getElementById("totalPrice").value = ${total};
                </script>`;
            res.writeHead(200, { "Content-Type": "text/html" });
            res.write(data);
            res.end();
        });
        con.end();
    });
}




function purchase(res) {
    let con = myMySQL.CreateConnection("128project");
    con.query("INSERT IGNORE INTO boughtstuff SELECT * FROM basket", (err, result) => {
        if (err) throw err;
        console.log("Stuff bought");
    });
    con.query("DELETE FROM basket", (err, result) => {
        if (err) throw err;
        console.log("Wiped from basket");
        res.writeHead(302, { "Location": "/basket" });
        res.end();
    });
    con.end();
}




http.createServer((req, res) => {
    console.log(req.url);

    if (req.url == "/") {
        goTo("/Hub.html", res);
    }

    else if (possibleCoursesURLs.includes(req.url)) {
        loadCoursesPages(res, req);
    }

    else if (req.url == "/addToBasket" && req.method == "POST") {
        addToBasket(res, req);
    }

    else if (req.url == "/basket")
    {
        loadBasket(res);
    }

    else if (req.method == "POST" && req.url == "/Purchase")
    {
        purchase(res);
    }
    else {
        goTo(req.url, res);
    }
}).listen(port);
