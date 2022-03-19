const router   = require('express').Router();
const User = require('../../models/user')
const { getWorkoutData } = require('../../controllers/workoutdata-controller');
const { profile_upload } = require('../../config/multer')
const fs = require('fs');
const express = require('express');
const { uploadToCloudinary, deleteFromCloudinary, ifMediaRouteHasUrlThenRedirect } = require('../../controllers/cloudinary-controller');
const { response } = require('express');


 
const getMediaPath = () => {
    let sep =  __dirname.includes('/')?'/':"\\"
    let url = __dirname.split(sep)
    url.pop()
    url.pop()
    return ([...url, 'static', 'profile-photos'].join(sep))
}


const getMediaUrl = (filename) => {
    let sep =  __dirname.includes('/')?'/':"\\"
    let url = __dirname.split(sep)
    url.pop()
    url.pop()
    return ([...url, 'static', 'profile-photos', filename].join(sep))
}

const deleteFiles = (files) => {
    // console.log(files)
    files.forEach(file => {
        var mpath = getMediaUrl(file)
        if (fs.existsSync(mpath)){
            // console.log(mpath)
            fs.unlink(mpath, err => {
                if (err) {
                    console.log('Failed to delete :', err , mpath)
                }else{
                    console.log('File Deleted : ' + mpath) 
                };
            });
        }
    });
    return true
}

const getFilesToBeDeleted = async (id, content) => {
    let user = await User.findById(id)
    return user[content]?[user[content].filename]:[]
}

// routes

router.get('/data', (req, res) => {
    let userID = req.session.passport.user
    // console.log(userID)
    User.findOne({"_id": userID}, {hash: 0, salt: 0, 'profilePhoto.meta': 0})
    .then((response) => {
        res.json(response)
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({response: "Failed"})
    })
})

router.post('/editprofile', (req, res) => {

    if(! ['name', 'gender', 'dob', 'height', 'weight', 'phone'].includes(req.body['field'])){
        res.status(401).end()
        return
    } 

    let userID = req.session.passport.user
    var update = {}
    update[req.body['field']] = req.body['value']

    User.findOneAndUpdate({"_id": userID}, update, {new: true})
    .then((response) => {
        if(req.body['field'] === 'weight'){
            User.findOneAndUpdate({"_id": userID}, {'weightHistory': [...response.weightHistory, {date: new Date(), weight: req.body['value']}]}, {new: true})
            .then((response) => {
                res.json(response)
            })
            .catch(() => {
                console.log(err)
                res.status(500).json({response: "Failed"})
            })
        }else{
            res.json(response)
        }
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({response: "Failed"})
    })


})

router.use('/getprofilephoto',
   ////// Checking media specific access


   // Not necessary
    // (req, res, next) => {
    //     let userID = req.session.passport.user
    //     if(req.url.includes(userID)){
    //         console.log(req.url)
    //         next()
    //     }else{
    //         res.status(401).end()
    //         return
    //     }
        
    // },
    
    // Disabled when cloudinary is added to manage media
    // express.static(getMediaPath())

    ifMediaRouteHasUrlThenRedirect,

    );  

router.post('/profilephoto', 

    (req, res, next) => {req.saveFileTo = 'ProfilePhotos'; req.fileField = 'profilephoto'; next()},
    uploadToCloudinary,


    // Disabled as media files are handled by cloudinary now. 
    // profile_upload.fields([{
    //     name: 'profilephoto', maxCount: 1
    //     }]) ,

    (req, res) => {

        let userID = req.session.passport.user
        var metaData =  req.files.profilephoto[0]


        //Disabled as media handled by  cloudinary

        // getFilesToBeDeleted(userID, 'profilePhoto')
        // .then((filesNamesToBeDeleted => {
        
            User.findOne({"_id": userID})
            .then((response) => {

                var public_id_of_media_to_be_deleted = response.profilePhoto ? response.profilePhoto.meta.public_id : null

                response.profilePhoto = { 
                    filename: metaData.secure_url, 
                    secureUrl: metaData.secure_url, 
                    meta: metaData
                }
                
                response.save()
                
                public_id_of_media_to_be_deleted && deleteFromCloudinary(public_id_of_media_to_be_deleted)

                //Disabled as media handled by  cloudinary
                // deleteFiles(filesNamesToBeDeleted)
                
                res.json(
                    response
                )
            })
            .catch(err => {
                console.log(err)
                res.status(500).json({response: "Failed"})
            })
    // }))
    })

    


router.get('/updatelocal', getWorkoutData, (req, res) => {
    var user = req.user._doc
    user.salt = null
    user.hash = null 
    res.json({credentials: user, workoutData: req.workoutData })
})

router.patch('/data',(req,res) => {
    let userID = req.session.passport.user
    let conditions = { _id: userID };
    User.findByIdAndUpdate(conditions, req.body, { new: true})
    .then((response) => {
        response.hash = null
        response.salt = null 
        res.json({
            response
        })
    })
    .catch(error => {
        console.log(error)
        res.json({
            response: "Failed to update"
        })
    })
})

module.exports = router