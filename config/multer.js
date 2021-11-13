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

var profile_storage = multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null, './static/profile-photos');
  },
  filename: function(req, file, callback) {
    var date = new Date()
    var arr = file.originalname.split('.')
    var extension = arr.length>1?arr[arr.length-1]:''
    let userID = req.session.passport.user
      callback(null, userID+'-'+date.getTime() +'.'+extension );
  }
})

var upload = multer({ storage: storage })
var protected_upload = multer({ storage: protected_storage })
var profile_upload = multer({ storage: profile_storage })


module.exports =  {upload, protected_upload, profile_upload} 