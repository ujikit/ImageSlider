const multer = require('multer')
const bodyParser = require('body-parser')
const express = require('express')
const app = express()

require('./routes.js')(app, bodyParser);

app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/assets'));
app.use(express.static(__dirname + '/views/images-gallery'));
app.use(express.static(__dirname + '/node_modules'));

var listener = app.listen(8888, function(){
  console.log('Listening on port ' + listener.address().port); //Listening on port 8888
});
