const express = require('express');
const path = require('path');
const fileUpload = require('express-fileupload');


let initial_path = path.join(__dirname, 'public');

const app = express();
app.use(express.static(initial_path));
app.use(fileUpload());


app.get('/', (req, res) => {
    res.sendFile(path.join(initial_path, "home.html"));
})

//uploading
app.post('/upload', (req, res) => {
    let file = req.files.image; 
    let date = new Date();

    //image name
    let imageName = date.getDate() + date.getTime() + file.name;
    //upload path:
    let path = 'public/uploads/' + imageName;
    
    //create upload
    file.mv(path, (err, result) => {
        if (err) {
            throw err;
        }else{
            res.json(`uploads/${imageName}`)
        }
    })
})

app.get('/editor', (req, res) => {
    res.sendFile(path.join(initial_path, 'editor.html'));
});

app.get("/admin", (req, res) => {
    res.sendFile(path.join(initial_path, "dashboard.html"));
})

app.get('/:blog', (req, res) => {
    res.sendFile(path.join(initial_path, "blog.html"));
})

app.get("/:blog/editor", (req, res) => {
    res.sendFile(path.join(initial_path, "editor.html"));
})

app.use((req, res) => {
    res.json('404');
})

app.listen(process.env.PORT || 3000);