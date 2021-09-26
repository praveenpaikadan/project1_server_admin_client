const router   = require('express').Router();
const Exercise = require('../../models/exercise');
const multer = require('multer');
const {protected_upload} = require('../../config/multer');

const fs = require('fs');

// routes

const getMediaUrl = (filename) => {
    let sep =  __dirname.includes('/')?'/':"\\"
    let url = __dirname.split(sep)
    url.pop()
    url.pop()
    return ([...url, 'static', 'protected-media', filename].join(sep))
}

const deleteFiles = (files) => {
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

const getFilesToBeDeleted = async (id, contents) => {
    let exercise = await Exercise.findById(id)
    filesNamesToBeDeleted = []
    for (content of contents) {
        if (content !== null){
            filesNamesToBeDeleted = [...filesNamesToBeDeleted, ...exercise[content].map(item => item.filename)]
        }
      }
    return filesNamesToBeDeleted
}


// routes
router.get('/:id', (req,res) => {
    console.log(req.params.id)
    // if there is no item null is returned.
    Exercise.findOne({"_id": req.params.id})
    .then(response => {
        res.json({
            response
        })
    })
    .catch(error => {
        console.log(err)
        res.json({
            response: 'An error Ocuured while fetching excercise details'
        })
    })
})

router.get('/', (req,res) => {
    Exercise.find()
    .then(response => {
        res.json({
            response
        })
    })
    .catch(error => {
        console.log(err)
        res.json({
            response: 'An error Ocuured while fetching excercise details'
        })
    })
})

router.post('/',

    protected_upload.fields([{
        name: 'images', maxCount: 2
        }, {
        name: 'video', maxCount: 1
        }]) ,
    
    (req, res) => {

        var data = req.body;

        if(req.files.images){
            var image1 = req.files.images[0];
            var image2 = req.files.images[1];
            data.images = [image1, image2];
        }

        if(req.files.video){
            var video = req.files.video[0];
            data.video = [video];
        }

        var instructions = []
        
        for(let key in data){
            if (key.split('-')[0] == 'step'){
                instructions.push({step: key.split('-')[1],  description: data[key]})
            }
        };

        data.equipments = data.equipments.split(',')

        data.instructions = instructions
        
        let exercise = new Exercise(data)

        exercise.save()   
        .then(response => {
            res.json({
                response
            })
        })
        
        .catch(error => {
            console.log('failed')
            res.status(500).json({
                response: "Failed"
            })
        })
});

router.patch('/',

    protected_upload.fields([{
        name: 'images', maxCount: 2
        }, {
        name: 'video', maxCount: 1
        }]) ,


    (req,res) => {
    
        var data = req.body;

        var instructions = []         
        for(let key in data){
            if (key.split('-')[0] == 'step'){
                instructions.push({step: key.split('-')[1],  description: data[key]})
            }
        };

        if (instructions.length>0){
            data.instructions = instructions
        }

        if(req.files.images){
            var image1 = req.files.images[0];
            var image2 = req.files.images[1];
            data.images = [image1, image2];
        }

        if(req.files.video){
            var video = req.files.video[0];
            data.video = [video];
        }

        data.equipments = data.equipments.split(',')
        console.log(data)

    

        let conditions = { _id: data.id };
        getFilesToBeDeleted(data.id, [data.images?'images':null, data.video?'video':null])
        .then((filesNamesToBeDeleted => {
            Exercise.findByIdAndUpdate(conditions, data, { new: true})
            .then((response) => {
                deleteFiles(filesNamesToBeDeleted)
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
                
        }))
});

router.delete('/:id', (req, res, next)=>{
    let id = req.params.id
    getFilesToBeDeleted(id, ['images', 'video'])
    .then(filesNamesToBeDeleted => {
        Exercise.findByIdAndDelete(id)
        .then((response) => {
            deleteFiles(filesNamesToBeDeleted);
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
    })
    .catch(err => {
        console.log(err)
        res.status(404).json({
            response: null,
            message: "No Item found"
        })
    })
})

module.exports = router