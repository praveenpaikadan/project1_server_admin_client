const multer = require('multer')


var storage = multer.diskStorage({


destination: function(req, file, callback) {
    callback(null, './static/media');
  },
  filename: function(req, file, callback) {
    if(file.originalname.length>6)
      callback(null, file.fieldname + '-' + Date.now() + file.originalname.substr(file.originalname.length-6,file.originalname.length));
    else
      callback(null, file.fieldname + '-' + Date.now() + file.originalname);
  }
});


var protected_storage = multer.diskStorage({
  destination: function(req, file, callback) {
      callback(null, './static/protected-media');
    },
    filename: function(req, file, callback) {
      if(file.originalname.length>6)
        callback(null, file.fieldname + '-' + Date.now() + file.originalname.substr(file.originalname.length-6,file.originalname.length));
      else
        callback(null, file.fieldname + '-' + Date.now() + file.originalname);
    }
  });

var upload = multer({ storage: storage })
var protected_upload = multer({ storage: protected_storage })


module.exports =  {upload, protected_upload} 