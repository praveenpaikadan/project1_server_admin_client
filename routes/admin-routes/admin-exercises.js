const router   = require('express').Router();
const Exercise = require('../../models/exercise')


// routes

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

router.post('/', (req, res, next) => {
    let exercise = new Exercise({
        exerciseName: req.body.exerciseName
    })

    exercise.save()   
    .then(response => {
        res.json({
            response
        })
    })
    .catch(error => {
        res.json({
            status: 0,
        })
    })
})

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