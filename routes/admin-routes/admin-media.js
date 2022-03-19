const router   = require('express').Router();
const Media = require('../../models/media');
const {upload} = require('../../config/multer');
const { deleteFiles } = require('../../lib/helpers');
const { uploadToCloudinary, deleteFromCloudinary } = require('../../controllers/cloudinary-controller');


router.get('/getall', (req,res) => {
    Media.find().select({_id: 1, relativeUrl: 1, identifierText: 1, secureUrl: 1}).sort({updatedAt: "descending"})
    .then(response => {
        res.json(response)
    })
    .catch(() => {
        res.status(500).end()
    })
})

router.get('/:id', (req,res) => {
    let id = req.params.id
    // console.log(id)
    Media.findOne({_id: id}).select({_id: 1, relativeUrl: 1, identifierText: 1})
    .then(response => {
        res.json(response)
    })
    .catch(() => {
        res.status(500).end()
    })
})

router.delete('/:id', (req,res) => {
    let id = req.params.id
    Media.findByIdAndDelete(id)
    .then(response => {
        // deleteFiles([response.meta.filename], 'media')   <= Replaced as media handling now done by cloudinary
        deleteFromCloudinary(response.meta.public_id)
        res.json(response)
    })
    .catch((error) => {
        console.log(error)
        res.status(500).end()
    })
})


router.post('/', 

    (req, res, next) => {req.saveFileTo = 'Media'; req.fileField = 'images'; next()},
    uploadToCloudinary,

    // Disabled as media files are handled by cloudinary now. 
    // upload.fields([{
    //     name: 'images', maxCount: 1
    //     }, {
    //     name: 'videos', maxCount: 1
    //     }]) ,

    (req, res) => {
        var data = req.files.images
        let mediaData = {}

        mediaData.meta = data[0]

        // mediaData.relativeUrl = '/media/'+data[0].filename  // <== Changed for cloudinary
        mediaData.relativeUrl = 'none'

        mediaData.identifierText = req.body.identifierText
        mediaData.secureUrl = mediaData.meta.secure_url

        let media = new Media(mediaData)
        media.save()
        .then(response => {
            // console.log(response)
            res.json({
                response
            })
        })

        .catch(error => {
            console.log(error)
            res.status(500).json({
                response: "Failed"
            })
        })
})

module.exports = router





