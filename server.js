const express = require('express');
const path = require('path');
const fileupload = require('express-fileupload');

let initial_path = path.join(__dirname, 'public');

const app = express();
app.use(express.static(initial_path));
app.use(fileupload());

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

app.listen("3000");