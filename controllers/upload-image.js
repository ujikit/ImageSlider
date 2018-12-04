const multer = require('multer')

  const uploadImage = () => {
    // multer function
      const storage = multer.diskStorage({
        destination: function (req, file, cb) {
          cb(null, './views/images-gallery');
        },
        filename: function (req, file, cb) {
          cb(null, file.fieldname + '-' + Date.now());
        }
      });
      function checkFileType (req, file, cb) {
        const filetypes = /jpeg|jpg|png/;
        const mimetype = file.originalname.match(filetypes)
        // count.push(req.files.length)
        if (mimetype) {
          console.log("berhasil");
          return cb(null, true)
        }
        else {
          console.log("gagal");
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
