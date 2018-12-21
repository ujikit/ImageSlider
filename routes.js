const fs = require('fs')
// file :
// upload image
const createAlbum = require('./controllers/create-album.js')
const uploadAlbumPhoto = createAlbum.uploadPhoto()
// ./file
// lowdb
const lowdb = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('./views/images-gallery/images-gallery.json')
const db = lowdb(adapter)

module.exports = (app, bodyParser) => {
  // app.use
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  // ./app.use
  app.get('/', function(req, res){
    res.render('index');
  })
  app.get('/add_album', function(req, res){
    res.render('add_album');
  })
  app.post('/add_album/input_name', function (req, res) {

    let album_name = Object.keys(req.body)[0]
    let countObj = JSON.parse(fs.readFileSync('./views/images-gallery/images-gallery.json'))

    var countObjPlus = countObj.image_gallery.length+1
    let folder = `./views/images-gallery/${album_name}`
    fs.mkdirSync(`${folder}`)
    db.get('image_gallery')
    .push({number: countObjPlus, album_name:`${album_name}`})
    .write()

  })
  app.post('/add_album/upload_photo',function(req,res){
    uploadAlbumPhoto(req,res, function(err) {
      if (err) return err;
      let photo_name = fs.readdirSync(`./views/images-gallery/${req.body.input_album_name2}`)
      let data_all = []
      data_all.push({
        "album_name" : req.body.input_album_name2,
        "photo_name" : photo_name
      })
      res.send(data_all);
    });
  });

}
