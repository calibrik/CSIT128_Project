var JSONdata;

function fillDescription(key) {
    document.getElementById("description").innerHTML = `
        <h2>${key + " course"}</h2>
        <img src="${JSONdata.courses[key].picture}" alt="Image" />
        <hr />
        <p>${JSONdata.courses[key].description}</p>`;
}

function fillPage() {
    document.getElementById("pageName").innerHTML = JSONdata.name;
    let text = "";
    Object.keys(JSONdata.courses).forEach(key => {
        text += `
            <div class="course-card">
                <img src="${JSONdata.courses[key].picture}" alt="Image" />
                <h3>${key}</h3>
                <p>${JSONdata.courses[key].price} AED</p>
                <h6>${JSONdata.courses[key].duration}<h6>
                </br>
                <a href="#description" onclick="fillDescription('${key}')">More info</a>
                <input type="checkbox" name="${key}" />
            </div>`;
    });
    document.getElementById("courseList").innerHTML = text;
}

function onSubmit(form) {
    /*var formData = new FormData(form);
    let text = "";
    for (let [name, value] of formData.entries()) {
        text += `${name} = ${value}\n`;
    }
    alert(text);*/
    return true;
}

function loadPage(file) {
    let req = new XMLHttpRequest();
    req.onreadystatechange = function () {
        if (req.readyState != 4 || req.status != 200) return;
        JSONdata = JSON.parse(req.responseText);
        //fillPage();
    }
    document.getElementById("fileName").value = file;
    req.open("GET", file);
    req.send();
}



console.log("listCourses.js initialized");
