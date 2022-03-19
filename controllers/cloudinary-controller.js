const cloudinary = require('cloudinary').v2


cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
  });


const uploadToCloudinary = (req, res, next) => {  // fileField and saveFileTo are additionl fields added in previous routes
    var file = req.files ? req.files[req.fileField] : null // only single image not 'images'
    if(file){
        cloudinary.uploader.upload(file.tempFilePath, {folder: req.saveFileTo || 'Others'}, function(err, result){
            if(result){
                req.files[req.fileField] = [result]
                next()
                return
            }
            if(err){
                console.log('Error with cloudinary, Image not uploaded', err)
                res.status(500).end()
                return
            }
            
        })
    }else{
        next()
    }
    
}

const deleteFromCloudinary = (media_public_id) => {
    cloudinary.uploader.destroy(media_public_id, function(error,result) {
        // console.log(error?error: 'Deleted media') 
    });
}

const ifMediaRouteHasUrlThenRedirect = (req, res, next) => {
    var endpartofurl = req.url
    // console.log(req.path)
    endpartofurl = endpartofurl.substring(1, endpartofurl.length + 1)
    if(endpartofurl.substring(0,4) === 'http'){
        res.redirect(endpartofurl)
    }
    else{
        next()
    }
}

module.exports =  {uploadToCloudinary, deleteFromCloudinary, ifMediaRouteHasUrlThenRedirect}