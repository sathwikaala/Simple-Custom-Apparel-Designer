var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

var app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

var things = require('./routes/things');
app.use('/', things);

app.use(express.static(path.join(__dirname, 'public')));
app.listen(3000);
console.log("Server Running on port 3000");
