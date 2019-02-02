const fs = require('fs')
// file :
// upload image
const createAlbum = require('./controllers/create-album.js')
const uploadAlbumPhoto = createAlbum.uploadPhoto()
// ./file
// lowdb image-gallery.json
const lowdb = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const imageGalleryAdapter = new FileSync('./views/images-gallery/images-gallery.json')
const ImageGalleryDB = lowdb(imageGalleryAdapter)

module.exports = (app, bodyParser) => {
  let get_folder_album = fs.readdirSync(`./views/images-gallery`)
  let get_folder_album2 = get_folder_album.filter(word => word.slice(-5) !== ".json");

  // console.log(get_folder_album2);
  // return 0
  // app.use
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  // ./app.use

  // index
  app.get('/', function(req, res){
    res.render('index');
  })
  app.get('/data_album', function(req, res){
    let get_data_album = fs.readFileSync(`./views/images-gallery/images-gallery.json`, `utf8`)
    let get_folder_album = fs.readdirSync(`./views/images-gallery`)
    let get_all = []
    // console.log(get_data_album);
    res.send(get_data_album)
  })
  // ./index

  app.get('/add_album', function(req, res){
    res.render('add_album');
  })

  app.post('/add_album/input_name', function (req, res) {
    let album_name = Object.keys(req.body)[0]
    let countObj = JSON.parse(fs.readFileSync('./views/images-gallery/images-gallery.json'))

    var countObjPlus = countObj.image_gallery.length+1
    let folderAlbumName = `./views/images-gallery/${album_name}`
    let jsonPhotoDataPerAlbum = `${folderAlbumName}/${album_name}.json`
    if (fs.existsSync(`${folderAlbumName}`)) { console.log("Duplikasi Nama Album"); return 0 }
    fs.mkdirSync(`${folderAlbumName}`) //create album folder

    ImageGalleryDB.get('image_gallery').push({
      number: countObjPlus,
      album_name:`${album_name}`
    }).write()

    const dataPhotoAdapter = new FileSync(`${jsonPhotoDataPerAlbum}`)
    const dataPhotoDB = lowdb(dataPhotoAdapter)
    fs.appendFileSync(`${jsonPhotoDataPerAlbum}`) //create json data on album folder photo
    dataPhotoDB.defaults({ photo_data: [{ album_name: album_name, photos: [] }]}).write()

  })

  app.post('/add_album/upload_photo',function(req,res){
    uploadAlbumPhoto(req,res, function(err) {
      if (err) return err;
      let photo_name = fs.readdirSync(`./views/images-gallery/${req.body.input_album_name2}`)
      let data_all = []
      data_all.push({
        "album_name" : req.body.input_album_name2,
        "photo_name" : "",
        "original_file_name" : photo_name
      })
      res.send(data_all);
    });
  });

  app.post('/add_album/save_album', function (req, res) {
    var data = req.body.data;

    let folderAlbumName = `./views/images-gallery/${data[0].album_name}`
    let jsonPhotoDataPerAlbum = `${folderAlbumName}/${data[0].album_name}.json`
    const dataAlbumAdapter = new FileSync(`${jsonPhotoDataPerAlbum}`)
    const dataAlbumDB = lowdb(dataAlbumAdapter)

    for (var i = 0; i < data[0].original_file_name.length; i++) {
      dataAlbumDB.get('photo_data[0].photos')
        .find({ original_file_name: `${data[0].original_file_name[i]}` })
        .assign({ photo_name: `${data[0].input_name[i]}`})
        .write()
    }
    // console.log(data);
    res.render('add_album');
  })

  app.get('/data/get-first-photo-per-album', function (req, res) {
    let data_album = JSON.parse(fs.readFileSync('./views/images-gallery/images-gallery.json'))

    var countTotalAlbum = Object.keys(data_album.image_gallery)

    let path_get_all_first_photo = []
    for (var i = 0; i < countTotalAlbum.length; i++) {
      let album_name = `${data_album.image_gallery[i].album_name}`

      let path_per_album = JSON.parse(fs.readFileSync(`./views/images-gallery/${album_name}/${album_name}.json`))

      path_get_all_first_photo.push(path_per_album)
    }

    var path_get_all_first_photo_FIX = []
    for (var i = 0; i < path_get_all_first_photo.length; i++) {
      path_get_all_first_photo_FIX.push({
        album_name: path_get_all_first_photo[i].photo_data[0].album_name,
        first_photo: path_get_all_first_photo[i].photo_data[0].photos[0].original_file_name,
        path_first_photo: `./views/images-gallery/${path_get_all_first_photo[i].photo_data[0].album_name}/${path_get_all_first_photo[i].photo_data[0].photos[0].original_file_name}`,
      })
      // path_get_all_first_photo_FIX.push(path_get_all_first_photo[i].photo_data[0].album_name);
    }

    res.json(path_get_all_first_photo_FIX)
  })

}
