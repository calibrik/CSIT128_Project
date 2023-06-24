//TODO: Protect from fools


'use strict'
var timeCookieAvailable = 600;
var http = require('http');
var port = process.env.PORT || 8080;
var uuid = require('uuid');
var url = require("url");
var myMySQL = require("./SQLModule.js");
var formidable = require("formidable");
var fs = require("fs");
var possibleCoursesURLs = ["/LawCourses", "/ProgrammingCourses", "/ArchitectureCourses", "/DesignCourses", "/MathCourses","/PhilosophyCourses"];
var extensionsToType = { "html": "text/html", "css": "text/css", "js": "text/javascript", "json": "application/json", "png": "image/png", "jpg": "image/jpg" };

function loadProfilePage(id) {
    return new Promise((resolve, reject) => {
        fs.readFile("data/html/profile.html", (err, data) => {
            if (err) reject(err);
            let con = myMySQL.CreateConnection("128project");
            con.query(`SELECT * FROM users WHERE id=${id};`, (err, result) => {
                if (err) reject(err);
                data += `<script>
                        document.getElementById("userBalanceShown").innerHTML="Current balance: ${result[0].balance}";
                        document.getElementById("userBalanceHiden").value=${result[0].balance};
                        document.getElementById("Name_1").innerHTML="${result[0].f_Name} ${result[0].l_Name}";
                        document.getElementById("email_1").innerHTML="Email: ${result[0].email}";
                        document.getElementById("fName").placeholder="${result[0].f_Name}";
                        document.getElementById("lName").placeholder="${result[0].l_Name}";
                        document.getElementById("email").placeholder="${result[0].email}";
                    </script>`;
            });
            con.query(`SELECT * FROM boughtstuff where user_id=${id};`, (err, results) => {
                if (err) throw err;
                let text = "";
                for (let i = 0; i < results.length; i++) {
                    text += `${results[i].courseName} - ${results[i].price}AED (${results[i].duration})<br /><br />`;
                }
                data += `<script>
                            document.getElementById("myCourses").innerHTML = "${text}";
                        </script>`
                resolve(data);
            });
            con.end();
        });
    });
}


function logout(req,res, id) {
    let con = myMySQL.CreateConnection("128project");
    con.query(`UPDATE users SET sessionId=NULL WHERE id=${id}`, (err, data) => {
        if (err) throw err;
        res.setHeader("Set-Cookie", `${req.headers.cookie}; max-age=0; path=/`);
        res.writeHead(302, { "Location": "/onlineCourse.html" });
        return res.end();
    });
    con.end();
}
function login(res, req) {
    let form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files) => {
        if (err) {
            console.log("Form error");
            res.statusCode = 500;
            return res.end();
        }
        let con = myMySQL.CreateConnection("128project");
        con.query(`SELECT * FROM users WHERE email="${fields.email}" && password="${fields.password}";`, (err, result) => {
            if (err) throw err;
            if (result.length == 0) {
                fs.readFile("data/html/login.html", (err, data) => {
                    if (err) throw err;
                    data += '<script>document.getElementById("authError").innerHTML="Authorization failed! Either email or password are incorrrect";</script>';
                    res.writeHead(200, { "Content-Type": "text/html" });
                    res.write(data);
                    return res.end();
                });
                return;
            }

            let sessionId = uuid.v4();
            let con = myMySQL.CreateConnection("128project");
            con.query(`UPDATE users SET sessionId="${sessionId}" WHERE email="${fields.email}";`, (err, result) => {
                if (err) throw err;
                res.setHeader("Set-Cookie", `${sessionId}; max-age=${timeCookieAvailable}; path=/`);
                res.writeHead(302, { "Location": "/onlineCourse2.html" });
                return res.end();
            });
            con.end();
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
function cookieToUserId(req) {
    return new Promise((resolve, reject) => {
        let sessionId = req.headers.cookie;
        console.log(sessionId);
        if (!sessionId) {
            if (req.url == "/register.html" || req.url == "/onlineCourse.html") {
                resolve();
                return;
            }
            reject("NoCookie");
            return;
        }
        let con = myMySQL.CreateConnection("128project");
        con.query(`SELECT id FROM users WHERE sessionId="${sessionId}"`, (err, result) => {
            if (err) {
                reject(err);
                return;
            }
            if (result.length == 0) {
                res.setHeader("Set-Cookie", `${req.headers.cookie}; max-age=0; path=/`);
                reject("NoCookie");
                return;
            }
            resolve(result[0].id);
        });
    });
}
function loadCoursesPages(res, req,id) {
    fs.readFile("data/html/Template for courses.html", (err, data) => {
        if (err) {
            console.log("Template not found");
            res.writeHead(404, { "Content-Type": "text/html" });
            return res.end("404 NOT FOUND");
        }
        data = data.toString();
        let con = myMySQL.CreateConnection("128project");
        con.query(`SELECT courseName FROM boughtstuff WHERE user_id=${id}`, (err, result) => {
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
function clearBasket(res, req, id) {
    let con = myMySQL.CreateConnection("128project");
    emptyBasket(con, id);
    con.end();
    res.writeHead(302, { "Location": "/basket" });
    return res.end();
}
function emptyBasket(con, id) {
    con.query(`DELETE FROM basket WHERE user_id=${id}`, (err, result) => {
        if (err) throw err;
        console.log("Wiped from basket");
    });
}
function addToBasket(res, req,id) {
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
            for (let i = 0; i < keys.length; ++i) {
                con.query(`INSERT INTO basket (user_id,courseName,picture,duration,price) VALUES (${id},"${keys[i]}","${listCourses[keys[i]].picture}","${listCourses[keys[i]].duration}",${listCourses[keys[i]].price});`,
                    (err, result) => {
                        if (err && err.errno == 1062) {
                            console.log(`${keys[i]} already in basket`);
                            if (i == keys.length - 1) {
                                res.writeHead(302, { "Location": "/basket" });
                                return res.end();
                            }
                            return;
                        }
                        if (i == keys.length - 1) {
                            res.writeHead(302, { "Location": "/basket" });
                            return res.end();
                        }
                        console.log(`Added ${keys[i]} to basket`);
                    });
            }
            con.end();
        });
    });
}
function loadBasket(res,id) {
    fs.readFile("data/html/basketPage.html", (err, data) => {
        if (err) {
            console.log(`basketPage.html error`);
            res.statusCode = 500;
            return res.end();
        }

        data = data.toString();
        let con = myMySQL.CreateConnection("128project");
        con.query(`SELECT * FROM basket WHERE user_id=${id}`, (err, results) => {
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
        con.query(`SELECT balance FROM users WHERE id=${id};`, (err, result) => {
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
function addFunds(res,req,id) {
    let args = url.parse(req.url,true).query;
    let con = myMySQL.CreateConnection("128project");
    con.query(`UPDATE users SET balance=${Number(args.userBalance) + Number(args.amount)} WHERE id=${id}`, (err, result) => {
        if (err) throw err;
        res.writeHead(302, { "Location": "/profile" });
        return res.end();
    });
}
function purchase(res,req,id) {
    let con = myMySQL.CreateConnection("128project");
    con.query(`INSERT IGNORE INTO boughtstuff SELECT * FROM basket WHERE user_id=${id}`, (err, result) => {
        if (err) throw err;
        console.log("Stuff bought");
    });
    emptyBasket(con, id);
    con.end();
    let form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files) => {
        if (err) {
            console.log("Form error");
            res.statusCode = 500;
            return res.end();
        }
        let con = myMySQL.CreateConnection("128project");
        con.query(`UPDATE users SET balance=${fields.userBalance - fields.total} WHERE id=${id};`, (err, result) => {
            if (err) throw err;
            console.log(`Current Balance ${fields.userBalance - fields.total}`);
            res.writeHead(302, { "Location": "/basket" });
            return res.end();
        });
        con.end();
    });
}
function loadProfile(res, id) {

    loadProfilePage(id)
        .then((data) => {
            res.writeHead(200, { "Content-Type": "text/html" });
            res.write(data);
            return res.end();
        })
        .catch((err) => {
            throw err;
        });
}
function updateUserProfileInfo(res, req, id) {
    let formNew = new formidable.IncomingForm();
    formNew.parse(req, (err, fields, files) => {
        if (err) {
            console.log("Form error");
            res.statusCode = 500;
            return res.end();
        }
        let con = myMySQL.CreateConnection("128project");
        con.query(`SELECT password FROM users WHERE id=${id};`, (err, result) => {
            if (err) throw err;
            if (fields.old_password != result[0].password) {
                loadProfilePage(id)
                    .then((data) => {
                        data += `<script>
                                 document.getElementById("fieldErrorFatal").innerHTML="Wrong current password!";
                                </script>`;
                        res.writeHead(200, { "Content-Type": "text/html" });
                        res.write(data);
                        return res.end();
                    })
                    .catch((err) => {
                        throw err;
                    })
            } else {

                con.query(`UPDATE users SET f_Name = "${fields.fName}", l_Name = "${fields.lName}", email = "${fields.email}", password = "${fields.password}" WHERE id=${id};`, (err, result) => {
                    if (err) throw err;
                    res.writeHead(302, { "Location": "/profile" });
                    return res.end();
                });
            }
        });
    });
}
function register(res, req) {
    let formNew = new formidable.IncomingForm();
    formNew.parse(req, (err, fields, files) => {
        if (err) {
            console.log("Form error");
            res.statusCode = 500;
            return res.end();
        }
        let con = myMySQL.CreateConnection("128project");
        con.query(`SELECT email FROM users WHERE email= "${fields.email}";`, (err, result) => {
            if (err) throw err;
            if (result.length != 0) {
                fs.readFile("data/html/register.html", (err, data) => {
                    if (err) throw err;
                    data += `<script>
                             document.getElementById("existFatal").innerHTML="THIS EMAIL IS ALREDY REGISTERED!";
                             </script>`;
                    res.writeHead(200, { "Content-Type": "text/html" });
                    res.write(data);
                    return res.end();

                });
                return;
            }

            let con = myMySQL.CreateConnection("128project");
            con.query(`INSERT INTO users (email, password, f_Name, l_Name) VALUES ("${fields.email}", "${fields.password}", "${fields.fName}", "${fields.lName}");`, (err, result) => {
                if (err) throw err;
                res.writeHead(302, { "Location": "/login.html" });
                return res.end();
            });
            con.end();
        });
        con.end();
    });
}

http.createServer((req, res) => {
    console.log(req.url);

    if (req.url == "/") {
        cookieToUserId(req)
            .then((id) => {
                goTo("/onlineCourse2.html", res);
            })
            .catch((err) => {
                if (err == "NoCookie") {
                    res.writeHead(302, { "Location": "/onlineCourse.html" });
                    return res.end();
                }
                throw err;
            });
    }
    else if (req.url == "/register" && req.method == "POST")
    {
        register(res, req);
    }
    else if (req.url == "/login.html") {
        cookieToUserId(req)
            .then((id) => {
                res.writeHead(302, { "Location": "/onlineCourse2.html" });
                return res.end();
            })
            .catch((err) => {
                if (err == "NoCookie") {
                    goTo(req.url, res);
                    return;
                }
                throw err;
            });
    }
    else if (req.url == "/logout")
    {
        cookieToUserId(req)
            .then((id) => {
                logout(req,res, id);
            })
            .catch((err) => {
                if (err == "NoCookie") {
                    res.writeHead(302, { "Location": "/onlineCourse.html" });
                    return res.end();
                }
                throw err;
            });
    }
    else if (req.url == "/profile") {
        cookieToUserId(req)
            .then((id) => {
                loadProfile(res, id);
            })
            .catch((err) => {
                if (err == "NoCookie") {
                    res.writeHead(302, { "Location": "/onlineCourse.html" });
                    return res.end();
                }
                throw err;
            });
    }
    else if (req.url.indexOf("/addFunds?") != -1) {
        cookieToUserId(req)
            .then((id) => {
                addFunds(res, req, id);
            })
            .catch((err) => {
                if (err == "NoCookie") {
                    res.writeHead(302, { "Location": "/onlineCourse.html" });
                    return res.end();
                }
                throw err;
            });
    }
    else if (possibleCoursesURLs.includes(req.url)) {
        cookieToUserId(req)
            .then((id) => {
                loadCoursesPages(res, req, id);
            })
            .catch((err) => {
                if (err == "NoCookie") {
                    res.writeHead(302, { "Location": "/onlineCourse.html" });
                    return res.end();
                }
                throw err;
            });
    }
    else if (req.url == "/updateProfile" && req.method == "POST") {
        cookieToUserId(req)
            .then((id) => {
                updateUserProfileInfo(res, req, id);
            })
            .catch((err) => {
                if (err == "NoCookie") {
                    res.writeHead(302, { "Location": "/onlineCourse.html" });
                    return res.end();
                }
                throw err;
            });
    }
    else if (req.url == "/clearBasket") {
        cookieToUserId(req)
            .then((id) => {
                clearBasket(res, req, id);
            })
            .catch((err) => {
                if (err == "NoCookie") {
                    res.writeHead(302, { "Location": "/onlineCourse.html" });
                    return res.end();
                }
                throw err;
            });
    }
    else if (req.url == "/addToBasket" && req.method == "POST") {
        cookieToUserId(req)
            .then((id) => {
                addToBasket(res, req, id);
            })
            .catch((err) => {
                if (err == "NoCookie") {
                    res.writeHead(302, { "Location": "/onlineCourse.html" });
                    return res.end();
                }
                throw err;
            });
    }
    else if (req.url == "/auth" && req.method == "POST") {
        login(res, req);
    }
    else if (req.url == "/basket") {
        cookieToUserId(req)
            .then((id) => {
                loadBasket(res, id);
            })
            .catch((err) => {
                if (err == "NoCookie") {
                    res.writeHead(302, { "Location": "/onlineCourse.html" });
                    return res.end();
                }
                throw err;
            });
    }

    else if (req.method == "POST" && req.url == "/Purchase") {
        cookieToUserId(req)
            .then((id) => {
                purchase(res, req, id);
            })
            .catch((err) => {
                if (err == "NoCookie") {
                    res.writeHead(302, { "Location": "/onlineCourse.html" });
                    return res.end();
                }
                throw err;
            });
    }
    else if (req.url.split(".")[1] == "html") {
        cookieToUserId(req)
            .then((id) => {
                if (req.url == "/register.html")
                    res.setHeader("Set-Cookie", `${req.headers.cookie}; max-age=0; path=/`);
                goTo(req.url, res);
            })
            .catch((err) => {
                if (err == "NoCookie") {
                    res.writeHead(302, { "Location": "/onlineCourse.html" });
                    return res.end();
                }
                throw err;
            });
    }
    else {
        goTo(req.url, res);
    }
}).listen(port);
