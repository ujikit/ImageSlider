const uploadImages = require('./controllers/upload-image.js')
const upload = uploadImages.uploadImage()

module.exports = (app) => {
  app.get('/', function(req, res){
    res.render('index');
  })
  app.get('/add_album', function(req, res){
    res.render('add_album');
  })
  app.post('/api/photo',function(req,res){
    upload(req,res,function(err) {

    });
  });

}
