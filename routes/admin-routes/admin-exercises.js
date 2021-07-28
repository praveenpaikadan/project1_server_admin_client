const router   = require('express').Router();
const Exercise = require('../../models/exercise');
const multer = require('multer');
const {upload} = require('../../config/multer');


// routes

router.get('/:id', (req,res) => {
    console.log(req.params.id)
    // if there is no item null is returned.
    Exercise.findOne({"_id": req.params.id})
    .then(response => {
        console.log(response)
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
            message: 'An error Ocuured while fetching excercise details'
        })
    })
})

router.post('/',

    upload.fields([{
        name: 'images', maxCount: 2
        }, {
        name: 'video', maxCount: 1
        }]) ,
    
    (req, res) => {

        var image1 = req.files.images[0];
        var image2 = req.files.images[1];
        var video = req.files.video[0];

        var data = req.body;

        var instructions = []
        
        for(let key in data){
            if (key.split('-')[0] == 'step'){
                instructions.push({step: key.split('-')[1],  description: data[key]})
            }
        };

        data.instructions = instructions
        
        console.log(data.instructions)

        let exercise = new Exercise({
            exerciseName : data.exerciseName,
            instructions: data.instructions, 	
            images:[image1, image2],
            video: [video],
            restInSec: data.restInSec,  
            repetitionType: data.repetitionType,
        })

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

router.patch('/',(req,res) => {
    let conditions = { _id: req.body.id };
    
    Exercise.findByIdAndUpdate(conditions, req.body.data, { new: true})
    .then((response) => {
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

router.delete('/', (req, res)=>{
    let conditions = { _id: req.body.id};
    Exercise.findByIdAndDelete(conditions)
    .then((response) => {
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

module.exports = router