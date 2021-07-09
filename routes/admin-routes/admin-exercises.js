const router   = require('express').Router();
const Exercise = require('../../models/exercise')

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
    console.log(req.body)
    let exercise = new Exercise({
        exerciseName : req.body.exerciseName,
    })
    exercise.save()   
    .then(response => {
        res.json({
            status: 1,
            response: 'Req saved'
        })
    })
    .catch(error => {
        res.json({
            status: 0,
        })
    })
})

module.exports = router