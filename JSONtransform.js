var fs = require("fs");
let fileNames = ["Programming", "Design", "Architecture", "Law", "Math", "Philosophy"];
for (let fileName of fileNames) {
    fileName = `data/json/${fileName}Courses.json`;
    fs.readFile(fileName, (err, data) => {
        if (err) throw err;
        data = JSON.parse(data);
        let newData = {
            name: data.name,
            courses: {}
        }
        try {
            for (let course of data.courses) {
                newData.courses[course.name] = {
                    price: course.price,
                    picture: course.picture,
                    description: course.description,
                    duration: course.duration
                };
            }
            fs.writeFileSync(fileName, JSON.stringify(newData));
        }
        catch {
        
        }  
    });
}
