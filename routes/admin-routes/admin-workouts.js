const router   = require('express').Router();
const WorkoutData = require('../../models/workout-data');

router.get('/', (req,res) => {

    var {userID, workoutID} = req.query 

    if(workoutID){
        WorkoutData.findOne({'_id': workoutID})
        .then(response => {
            res.json({response})
        })
        .catch(error => {
            console.log(error)
            res.json({
                error: 'An error Ocuured while fetching workout details'
            })
        })

    }else if(userID){
        WorkoutData.find({'userID': userID}).select({history: 0 }).sort({updatedAt: "descending"})
        .then(response => {
            res.json({response})
        })
        .catch(error => {
            console.log(error)
            res.json({
                error: 'An error Ocuured while fetching workout details'
            })
        })

    }else{
        WorkoutData.find().select({history: 0 }).sort({updatedAt: "descending"})
        .then(response => {
            res.json({response})
        })
        .catch(error => {
            console.log(error)
            res.json({
                error: 'An error Ocuured while fetching workout details'
            })
        })
    }
})


module.exports = router
