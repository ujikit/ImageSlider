const multer = require('multer')
const lowdb = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const fs = require('fs')

  const uploadPhoto = () => {
    // multer function
      const storage = multer.diskStorage({
        destination: function (req, file, cb) {
          let folder_album_name = req.body.input_album_name2
          cb(null, `./views/images-gallery/${folder_album_name}`);
        },
        filename: function (req, file, cb) {
          let folder_album_name = req.body.input_album_name2
          cb(null, file.originalname);

          const folderAlbumName = `./views/images-gallery/${folder_album_name}`

          const jsonPhotoDataPerAlbum = `${folderAlbumName}/${folder_album_name}.json`
          let countObj = JSON.parse(fs.readFileSync(`${folderAlbumName}/${folder_album_name}.json`))
          let countObjCounter = countObj.photo_data[0].photos.length+1

          const dataPhotoAdapter = new FileSync(`${jsonPhotoDataPerAlbum}`)
          const dataPhotoDB = lowdb(dataPhotoAdapter)
          dataPhotoDB.get('photo_data[0].photos').push({
            number: countObjCounter,
            photo_name: "",
            original_file_name: file.originalname,
            time_per_photo: ""
          }).write()

        }
      });
      function checkFileType (req, file, cb) {
        let filetypes = /jpeg|jpg|png|JPEG|JPG|PNG/; //check image type (case sensitive)
        let mimetype = file.originalname.match(filetypes)
        if (mimetype) { return cb(null, true) }
        else { return cb(null, false) }
      }
      return multer({
        storage : storage,
        fileFilter : function (req, file, cb) {
          checkFileType(req, file, cb)
        }
      }).any()
      // ./multer function
  }

  module.exports = {
    uploadPhoto
  }
