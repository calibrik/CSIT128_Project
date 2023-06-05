var JSONdata;
function fillDescription(id) {
    document.getElementById("description").innerHTML =`
                <h2>${JSONdata.courses[id].name + " course"}</h2>
                <hr />
                <p>${JSONdata.courses[id].description}</p>`
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
/*JSONdata = JSON.parse(`{
  "courses": [
    {
        "picture": "AI.png",
        "name": "AI",
        "price": 199,
        "description": "Course will help you to learn AI"
    },
    {
        "picture": "Python.png",
        "name": "Python",
        "price": 300,
        "description": "Course will help you to learn and develop on Python"
    },
    {
        "picture": "placeholder-image.png",
        "name": "HTML",
        "price": 102,
        "description": "Course will help you to learn how to make sites with HTML"
    },
    {
        "picture": "placeholder-image.png",
        "name": "3D Modeling",
        "price": 550,
        "description": "Course will help you to learn how to create various 3D models"
    }
]
}`);
fillTable();*/
let req = new XMLHttpRequest();
req.onreadystatechange = function () {
    if (req.readyState != 4 || req.status != 200) return;
    JSONdata = JSON.parse(req.responseText);
    fillTable();
}
req.open("GET", "listCourses.json");
req.send();