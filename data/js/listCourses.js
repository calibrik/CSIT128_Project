var JSONdata;

function fillDescription(key) {
    document.getElementById("description").innerHTML = `
        <h2>${key + " course"}</h2>
        <img src="${JSONdata.courses[key].picture}" alt="Image" />
        <hr />
        <p>${JSONdata.courses[key].description}</p>`;
}

function onSubmit(form) {
    var formData = new FormData(form);
    var values = Array.from(formData.values()); 
    if (values.length === 1) {
        alert("You should select something before adding");
        return false;
    }
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
