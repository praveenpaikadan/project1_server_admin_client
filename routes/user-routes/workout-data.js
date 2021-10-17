const { getWorkoutData } = require('../../controllers/workoutdata-controller');
const Program = require('../../models/program');
const { insertMany, deleteOne } = require('../../models/workout-data');
const WorkoutData = require('../../models/workout-data')
const router   = require('express').Router();
const Exercise = require('../../models/exercise')

router.get('/', getWorkoutData, (req, res) => {
    res.json(req.workoutData)
})

router.get('/exercise/:id', (req,res) => {
    Exercise.findOne({"_id": req.params.id})
    .then(response => {
        res.json(response)
    })
    .catch(error => {
        console.log(err)
        res.status(500).json({
            message: 'An error Ocuured while fetching excercise details'
        })
    })
})

// This route pushes a days workout to the workout history
router.post('/push', (req, res) => {
    var wodata = req.body.dayWorkoutData
    var day = wodata.day
    var woID = wodata.workoutID

    console.log(wodata)


    // TBD => include functions to Examine recieved wodata then end or continue with request

    // WorkoutData.findOneAndUpdate({_id: woID, 'history.day': day}, { $set: { history: wodata } }, {new: true})
    // WorkoutData.findOneAndUpdate(conditions, update, {new: true})
    // WorkoutData.findOneAndUpdate({_id: woID, 'history.day': day}, wodata, {upsert: true, new: true})  
    
    

    // https://stackoverflow.com/questions/41888312/update-element-in-array-if-exists-else-insert-new-element-in-that-array-in-mongo


    // TBD || This is not an efficient method. research for a better one later already spend half a day on it.  --- DONE

    // WorkoutData.findOneAndUpdate(conditions, { '$pull': {'history': {day: day}}}, (() => 
    //     WorkoutData.findOneAndUpdate(conditions, {'$addToSet': {'history': wodata}}, {new: true})
    //     .then(result => {
    //         console.log(result)
    //         res.json(result)
    //     })
    //     .catch(err => console.log(err))
    //     ))


    // important => https://www.geeksforgeeks.org/mongodb-db-collection-bulkwrite-method/
    WorkoutData.bulkWrite([
        {
        updateOne:{
            filter: { _id: woID},
            update: { '$pull': {'history': {day: day}}}}
        },
        {
        updateOne:{
            filter: { _id: woID},
            update: {'$addToSet': {'history': wodata}}}
        }
        ], {ordered: true})

    .then(result => {
    console.log(result)
    res.json(result)
    })
    .catch(err => console.log(err))
})

module.exports = router
