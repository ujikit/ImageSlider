const multer = require('multer')

  const uploadImage = () => {
    // multer function
      const storage = multer.diskStorage({
        destination: function (req, file, cb) {
          let folder_album_name = req.body.input_number_album
          cb(null, `./views/images-gallery/${folder_album_name}`);
        },
        filename: function (req, file, cb) {
          // cb(null, file.fieldname + '-' + Date.now());
          cb(null, file.originalname);
        }
      });
      function checkFileType (req, file, cb) {
        let filetypes = /jpeg|jpg|png/;
        let mimetype = file.originalname.match(filetypes)
        // count.push(req.files.length)
        if (mimetype) {
          return cb(null, true)
        }
        else {
          return cb(null, false)
        }
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
    uploadImage
  }
