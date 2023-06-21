//TODO: Add button "add funds"
//TODO: Multiple users support
'use strict';
var http = require('http');
var port = process.env.PORT || 8080;
var url = require("url");
var myMySQL = require("./SQLModule.js");
var formidable = require("formidable");
var fs = require("fs");
var possibleCoursesURLs = ["/LawCourses", "/ProgrammingCourses", "/ArchitectureCourses", "/DesignCourses", "/MathCourses","/PhilosophyCourses"];
var extensionsToType = { "html": "text/html", "css": "text/css", "js": "text/javascript", "json": "application/json", "png": "image/png", "jpg": "image/jpg" };

function loadProfile(res) {
    fs.readFile("data/html/profile.html", (err, data) => {
        if (err) throw err;
        let con = myMySQL.CreateConnection("128project");
        con.query("SELECT balance FROM users WHERE id=1;", (err, result) => {
            if (err) throw err;
            data += `<script>document.getElementById("userBalance").innerHTML="Current balance: ${result[0].balance}";</script>`
            res.writeHead(200, { "Content-Type": "text/html" });
            res.write(data);
            return res.end();
        });
        con.end();
    });
}

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
        data = data.toString();
        let con = myMySQL.CreateConnection("128project");
        con.query("SELECT * FROM boughtstuff", (err, result) => {
            if (err) throw err;
            fs.readFile(`data/json/${req.url.slice(1)}.json`, (err, JSONdata) => {
                if (err) throw err;
                let text = "";
                JSONdata = JSON.parse(JSONdata);
                Object.keys(JSONdata.courses).forEach(key => {
                    let isBought = false;
                    for (let course of result) {
                        if (course.courseName == key) {
                            isBought = true;
                            break;
                        }
                    }
                    text += `
                    <div class="course-card">
                        <img src="${JSONdata.courses[key].picture}" alt="Image" />
                        <h3>${key}</h3>
                        <p>${JSONdata.courses[key].price} AED</p>
                        <h6>${JSONdata.courses[key].duration}<h6>
                        </br>
                        <a href="#description" onclick="fillDescription('${key}')">More info</a>\n`;
                    if (isBought) text += `<input type="checkbox" disabled name="${key}" /> <label>Already bought</label></div>`;
                    else text += `<input type="checkbox" name="${key}" /></div>`;
                });
                data += `
                <script>
                document.getElementById("pageName").innerHTML = "${JSONdata.name}";
                document.getElementById("courseList").innerHTML = \`${text}\`;
                </script >`;
                data = data.replace("INSERT_FILE_NAME", `"${`${req.url.slice(1)}.json`}"`);
                res.writeHead(200, { "Content-Type": "text/html" });
                res.write(data);
                return res.end();
            });
        });
    });
}




function addToBasket(res, req) {
    let form = new formidable.IncomingForm();
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
                document.getElementById("totalPrice").value = ${total};`;
        });
        con.query("SELECT balance FROM users WHERE id=1;", (err, result) => {
            if (err) throw err;
            console.log(`Current Balance ${result[0].balance}`);
            data += `document.getElementById("userBalance").value=${result[0].balance};</script>`
            res.writeHead(200, { "Content-Type": "text/html" });
            res.write(data);
            return res.end();
        });
        con.end();
    });
}




function purchase(res,req) {
    let con = myMySQL.CreateConnection("128project");
    con.query("INSERT IGNORE INTO boughtstuff SELECT * FROM basket", (err, result) => {
        if (err) throw err;
        console.log("Stuff bought");
    });
    con.query("DELETE FROM basket", (err, result) => {
        if (err) throw err;
        console.log("Wiped from basket");
    });
    con.end();
    let form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files) => {
        if (err) {
            console.log("Form error");
            res.statusCode = 500;
            return res.end();
        }
        let con = myMySQL.CreateConnection("128project");
        con.query(`UPDATE users SET balance=${fields.userBalance - fields.total} WHERE id=1;`, (err, result) => {
            if (err) throw err;
            console.log(`Current Balance ${fields.userBalance - fields.total}`);
            res.writeHead(302, { "Location": "/basket" });
            return res.end();
        });
        con.end();
    });
}




http.createServer((req, res) => {
    console.log(req.url);

    if (req.url == "/") {
        goTo("/onlineCourse2.html", res);
    }
    else if (req.url == "/profile")
    {
        loadProfile(res);
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
        purchase(res,req);
    }
    else {
        goTo(req.url, res);
    }
}).listen(port);
