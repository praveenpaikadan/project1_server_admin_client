const router   = require('express').Router();
const Program = require('../../models/program');
const multer = require('multer');
const {upload} = require('../../config/multer');

const fs = require('fs');

// routes

const getMediaUrl = (filename) => {
    let sep =  __dirname.includes('/')?'/':"\\"
    let url = __dirname.split(sep)
    url.pop()
    url.pop()
    return ([...url, 'static', 'media', filename].join(sep))
}

const deleteFiles = (files) => {
    files.forEach(file => {
        var mpath = getMediaUrl(file)
        if (fs.existsSync(mpath)){
            // console.log(mpath)
            fs.unlink(mpath, err => {
                if (err) {
                    console.log('Failed to delete :', err, mpath)
                }else{
                    console.log('File Deleted : ', mpath) 
                };
            });
        }
    });
    return true
}

const getFilesToBeDeleted = async (id, contents) => {
    let program = await Program.findById(id)
    filesNamesToBeDeleted = []
    for (content of contents) {
        if (content !== null){
            filesNamesToBeDeleted = [...filesNamesToBeDeleted, ...program[content].map(item => item.filename)]
        }
      }
    return filesNamesToBeDeleted
}


// routes
router.get('/:id', (req,res) => {

    // if there is no item null is returned.
    Program.findOne({"_id": req.params.id})
    .then(response => {
        res.json({
            response
        })
    })
    .catch(error => {
        console.log(error)
        res.json({
            error: 'An error Ocuured while fetching program details'
        })
    })
})

router.get('/', (req,res) => {
    Program.find().select({schedule: 0, goal: 0, images: 0, videos: 0, subscriptionOptions:0, equipments: 0, meta: 0}).sort({updatedAt: "descending"})
    .then(response => {
        res.json({
            response
        })
    })
    .catch(error => {
        console.log(error)
        res.json({
            error: 'An error Ocuured while fetching program details'
        })
    })
})

router.post('/',

    // Disbaled as part of integration with Cloudinary. Form data parsing functionality of 'multer' is now carried out by 'express-fileupload'
    // upload.fields([{
    //     name: 'images', maxCount: 1
    //     }, {
    //     name: 'videos', maxCount: 1
    //     }]) ,
    
    (req, res) => {
        // console.log(req.body)
        var data = JSON.parse(req.body.data)
        
        // data.images = req.files.images
        // data.videos = req.files.videos
        
        // console.log(data)

        let program = new Program(data)

        program.save()   
        .then(response => {
            res.json(
                response
            )
        })
        .catch(error => {
            console.log(error)
            res.status(500).json({
                error: "Failed"
            })
        })
});

router.patch('/',

    // Disbaled as part of integration with Cloudinary. Form data parsing functionality of 'multer' is now carried out by 'express-fileupload'
    // upload.fields([{
    //     name: 'images', maxCount: 1
    //     }, {
    //     name: 'videos', maxCount: 1
    //     }]) ,


    (req,res) => {
        

        var data = JSON.parse(req.body.data)
        var id = req.body.id

        // if(req.files.images){
        //     var image1 = req.files.images[0];
        //     data.images = [image1];
        // }

        // if(req.files.videos){
        //     var video = req.files.videos[0];
        //     data.videos = [video];
        // }

        // console.log(data.privateClients)
        let conditions = { _id: id };
        // getFilesToBeDeleted(id, [data.images?'images':null, data.videos?'videos':null])
        // .then((filesNamesToBeDeleted => {
            Program.findByIdAndUpdate(conditions, data, { new: true})
            .then((response) => {
                // deleteFiles(filesNamesToBeDeleted)
                res.json({
                    response
                })
            })
    
            .catch(err => {
                console.log(err)
                res.status(400).json({
                    response: "Failed to update"
                })
            })
                
        // }))
});

router.delete('/:id', (req, res, next)=>{
    let id = req.params.id
    // getFilesToBeDeleted(id, ['images', 'videos'])
    // .then(filesNamesToBeDeleted => {
        Program.findByIdAndDelete(id)
        .then((response) => {
            // deleteFiles(filesNamesToBeDeleted);
            res.json({
                response
            })
        })
        .catch(error => {
            console.log(err)
            res.json({
                response: "Failed to update"
            })
        })
    // })
    // .catch(err => {
    //     console.log(err)
    //     res.status(404).json({
    //         response: null,
    //         message: "No Item found"
    //     })
    // })
})

module.exports = router