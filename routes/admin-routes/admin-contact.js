const router   = require('express').Router();
const Contact = require('../../models/contact-details');
const {upload} = require('../../config/multer');
const { deleteFiles } = require('../../lib/helpers');
const { uploadToCloudinary, deleteFromCloudinary } = require('../../controllers/cloudinary-controller');


router.get('/', (req,res) => {
    Contact.find().select({updatedAt: 0, createdAt: 0}).sort('updatedAt')
    .then(response => {
        res.json(
            response
        )
    })
    .catch(error => {
        console.log(err)
        res.json({
            error: 'An error Ocuured while fetching contact datails'
        })
    })
})

router.post('/', 

    (req, res, next) => {req.saveFileTo = 'AdminProfile'; req.fileField = 'photo'; next()},
    uploadToCloudinary,

    // Disabled due to Cloudinary
    // upload.fields([{
    //     name: 'photo', maxCount: 1
    //     }]) ,

    (req, res) => {

        options = { upsert: true, new: true, setDefaultsOnInsert: true }
        update = JSON.parse(req.body.data)

        if(req.files.photo){ 
            // console.log(req.files.photo);
            update.photo.meta = req.files.photo[0]
            update.photo.filename = update.photo.meta.secure_url
            update.photo.secureUrl = update.photo.meta.secure_url
        };
        
        Contact.find()
        .then((conArr) => {
            if(conArr[0]){
                id = conArr[0]['id']
                // var filesToDelete = conArr[0].photo && req.files.photo?[conArr[0]['photo']['filename']]:[]   
                Contact.findOneAndUpdate({_id: id}, update, options)
                .then(response => {
                    // deleteFiles(filesToDelete, 'media')
                    deleteFromCloudinary(response.meta.public_id)
                    res.json(
                        response
                    )
                })
                .catch(error => {
                    console.log(error)
                    res.json({
                        response: 'Failed to fetch contact'
                    })
                })
            }else{
                let contact = new Contact(update)
                contact.save()
                .then((resp) => {
                    res.json(resp)
                }) 
                .catch(error => {
                    console.log(error)
                    res.json({
                        response: 'Failed to fetch contact'
                    })
                })

            }
        })
        .catch(error => {
            console.log(error)
            res.json({
                response: 'Failed to fetch contact'
            })
        })
})

module.exports = router





