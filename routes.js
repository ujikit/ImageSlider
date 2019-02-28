const fs = require('fs')
const fsExtra = require('fs-extra') //delete directory (album) recursive
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

  app.post('/delete_album', function(req, res){
    let data = req.body;
    let rmDir = fsExtra.remove(`./views/images-gallery/${data.data}`, err => {
      if (err) {
        return res.json({
          status: "error",
          data: "Error while deleting album.."
        })
      }
      ImageGalleryDB.get('image_gallery').remove({ album_name: `${data.data}` }).write()
      return res.json({
        status: "success",
        data: "Successfully deleted.."
      })
    })
  })

  app.post(`/play_album`, function (req, res) {
    let data = req.body
    let folderAlbumName = `./views/images-gallery/${data.data}`
    let jsonPhotoDataPerAlbum = `${folderAlbumName}/${data.data}.json`
    let readAllPhotoData = JSON.parse(fs.readFileSync(jsonPhotoDataPerAlbum))
    console.log(JSON.stringify(readAllPhotoData));
    return res.json({readAllPhotoData})
  })
  // ./index

  app.get('/add_album', function(req, res){
    res.render('add_album');
  })

  app.post('/add_album/input_name', function (req, res) {
    let album_name = Object.keys(req.body)[0]
    let dataImageGallery = JSON.parse(fs.readFileSync('./views/images-gallery/images-gallery.json'))

    // CHECK, duplicate album name
    for (var i = 0; i < dataImageGallery.image_gallery.length; i++) {
      if (album_name == dataImageGallery.image_gallery[i].album_name) {
        return res.json({
          status: "error",
          data: "Duplikasi Nama Album"
        })
      }
    }
    // ./CHECK, duplicate album name

    var countObjPlus = dataImageGallery.image_gallery.length+1
    let folderAlbumName = `./views/images-gallery/${album_name}`
    let jsonPhotoDataPerAlbum = `${folderAlbumName}/${album_name}.json`
    fs.mkdirSync(`${folderAlbumName}`) //create album folder

    ImageGalleryDB.get('image_gallery').push({
      number: countObjPlus,
      album_name:`${album_name}`
    }).write()

    const dataPhotoAdapter = new FileSync(`${jsonPhotoDataPerAlbum}`)
    const dataPhotoDB = lowdb(dataPhotoAdapter)
    fs.appendFileSync(`${jsonPhotoDataPerAlbum}`) //create json data on album folder photo
    dataPhotoDB.defaults({ photo_data: [{ album_name: album_name, photos: [] }]}).write()

    return res.json({
      status: "success",
      data: "Berhasil Disimpan!"
    })
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
    // VALIDATION: no image uploaded
    if (data[0].original_file_name == undefined) {
      return res.json({
        status: "error",
        data: "Upload foto dulu..",
      });
    }
    // ./VALIDATION: no image uploaded
    for (var i = 0; i < data[0].original_file_name.length; i++) {
      dataAlbumDB.get('photo_data[0].photos')
        .find({ original_file_name: `${data[0].original_file_name[i]}` })
        .assign({ photo_name: `${data[0].input_name[i]}`, time_per_photo: `${data[0].timer}` })
        .write() //update lowdb
    }
    res.json({
      status: "success",
      data: "Album berhasil tersimpan!"
    })
  })

  // GET DATA
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
        path_first_photo: `${path_get_all_first_photo[i].photo_data[0].album_name}/${path_get_all_first_photo[i].photo_data[0].photos[0].original_file_name}`,
      })
    }
    res.json(path_get_all_first_photo_FIX)
  })
  // ./GET DATA

}
