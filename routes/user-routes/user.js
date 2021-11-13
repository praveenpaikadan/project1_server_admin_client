const router   = require('express').Router();
const User = require('../../models/user')
const { getWorkoutData } = require('../../controllers/workoutdata-controller');
const { profile_upload } = require('../../config/multer')
const fs = require('fs');
const express = require('express')


 
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
    console.log(files)
    files.forEach(file => {
        var mpath = getMediaUrl(file)
        if (fs.existsSync(mpath)){
            console.log(mpath)
            fs.unlink(mpath, err => {
                if (err) {
                    console.log('Failed to delete :' + mpath)
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
    return [user[content].filename]
}

// routes

router.get('/data', (req, res) => {
    let userID = req.session.passport.user
    console.log(userID)
    User.findOne({"_id": userID}, {hash: 0, salt: 0})
    .then((response) => {
        res.json({response})
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({response: "Failed"})
    })
})

router.post('/editprofile', (req, res) => {
    let userID = req.session.passport.user
    var update = {}
    update[req.body['field']] = req.body['value']

    User.findOneAndUpdate({"_id": userID}, update, {new: true})
    .then((response) => {
        res.json(response)
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({response: "Failed"})
    })
})

router.use('/getprofilephoto',
   ////// Checking media specific access
    (req, res, next) => {
    
        let userID = req.session.passport.user
        if(req.url.includes(userID)){
            next()
        }else{
            res.status(401).end()
            return
        }
        
    },
    express.static(getMediaPath())
    );  

router.post('/profilephoto',     

    profile_upload.fields([{
        name: 'profilephoto', maxCount: 1
        }]) ,

    (req, res) => {

        let userID = req.session.passport.user
        console.log(userID)
        getFilesToBeDeleted(userID, 'profilePhoto')
        .then((filesNamesToBeDeleted => {
            User.findOneAndUpdate({"_id": userID}, {profilePhoto: req.files.profilephoto[0]}, {new: true})
            .then((response) => {
                deleteFiles(filesNamesToBeDeleted)
                    res.json({
                        response
                    })
            })
            .catch(err => {
                console.log(err)
                res.status(500).json({response: "Failed"})
            })
    }))
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