const multer = require('multer')
const bodyParser = require('body-parser')
const express = require('express')
const app = express()
const cors = require('cors')

require('./routes.js')(app, bodyParser);
app.use(function(req,res,next){
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
        res.send(200);
    }
    else {
        next();
    }
});
app.set('view engine', 'ejs');
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('views/images-gallery')); //untuk fetch gambar otomatis ke web saat append
app.use(express.static(__dirname + '/assets')); // untuk gambar awal saat belum ada foto yang diupload
app.use(express.static(__dirname + '/node_modules')); // untuk akses node modules

var listener = app.listen(8888, function(){
  console.log('Listening on port ' + listener.address().port); //Listening on port 8888
});
