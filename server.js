const express = require('express');
const hbs = require('hbs');

var app = express();
var fs = require('fs')
var jsonfile = require('jsonfile')
app.use(express.json());

var bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));


hbs.registerPartials(__dirname + '/views/partials')
app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public'));

hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear()
});

app.get('/', (req, res) => {
    var file = 'data.json';
    jsonfile.readFile(file, function(err, obj) {
        for (var i = 0; i < obj.length; i++)
            console.log(obj[i]);
        res.render('home.hbs', {
            arr: obj
        });
    })
});

app.post('/addTask', (req, res) => {
    var file = 'data.json';
    jsonfile.readFile(file, function(err, obj) {
        var index = obj.length;
        next_id = index+1;
        var next_task = req.body.task;
        var obj1 = {
            id: next_id,
            task: next_task
        }
        obj.push(obj1);
        console.log(obj);
        console.log(typeof obj);
        fs.writeFile('data.json', JSON.stringify(obj), 'utf8');
        res.render('home.hbs', {
            arr: obj
        });
    })
});

app.get('/add', (req, res) => {
    res.render('add.hbs');
});

app.get('/update/:id', (req, res) => {
    var update_id = req.params.id;
    var file = "data.json";

    jsonfile.readFile(file, function(err, obj) {
        if (err)
            console.log("something went wrong");
        else {
            task = obj[update_id - 1].task;

            res.render('update.hbs', {
                data: task,
                id: update_id
            });
        }
    })
});

app.post('/updateTask/:id', (req, res) => {
    var update_id = req.params.id;
    var taskUpdate = req.body.task1;
    //console.log(taskUpdate);
    var file = "data.json";
    jsonfile.readFile(file, function(err, obj) {
        if (err)
            console.log("something went wrong");
        else {

            obj[update_id - 1].task = taskUpdate;
            //console.log(taskUpdate);
            fs.writeFile('data.json', JSON.stringify(obj), 'utf8');
            res.render('home.hbs',{ arr: obj });
        }
    })
});

app.get('/delete/:id', (req, res) => {
    var del_id = req.params.id;
    var file = "data.json";
    jsonfile.readFile(file, function(err, obj) {
        if (err)
            console.log("something went wrong");
        else {
            delete obj[del_id - 1];
            fs.writeFile('data.json', JSON.stringify(obj), 'utf8');
        }
        res.render('home.hbs', {arr: obj});
    })
});


app.listen(3000, () => {
    console.log('Server is up on port 3000');
});
