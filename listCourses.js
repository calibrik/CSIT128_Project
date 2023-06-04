var JSONdata;
function fillDescription(id) {
    document.getElementById("descriptionH").innerHTML = JSONdata.courses[id].name + " course";
    document.getElementById("descriptionP").innerHTML = JSONdata.courses[id].description;
}
function fillTable() {
    let text = "";
    for (let i = 0; i < JSONdata.courses.length; i++)
        text += `<tr>
                        <td><img src="${JSONdata.courses[i].picture}" alt="Image" width="50" height="50" /></td>
                        <td>${JSONdata.courses[i].name + " course"}</td><td>${JSONdata.courses[i].price}AED</td>
                        <td><input type="checkbox" name="${JSONdata.courses[i].name}" /></td>
                        <td><a href="#descriptionH" onclick="fillDescription(${i})">More info</a></td>
                        </tr>`;
    document.getElementById("forJSON").innerHTML = text;
}
function onSubmit(form) {
    return true;
}

let req = new XMLHttpRequest();
req.onreadystatechange = function () {
    if (req.readyState != 4 || req.status != 200) return;
    JSONdata = JSON.parse(req.responseText);
    fillTable();
}
req.open("GET", "listCourses.json");
req.send();