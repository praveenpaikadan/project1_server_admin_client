const { insertMany, deleteOne } = require('../../models/workout-data');
const WorkoutData = require('../../models/workout-data')
const router   = require('express').Router();

router.get('/', (req, res) => {
    var user = req.user._doc._id
    WorkoutData.findOne({"userID": user})
    .then(response => {
        res.json({
            response
        })
    })
    .catch(error => {
        // console.log(error)
        res.json({
            errorMessage: 'An error Ocuured while fetching workout details'
        })
    })
})


// This route pushes a days workout to the workout history
router.post('/push', (req, res) => {
    var wodata = req.body.workoutData
    var day = wodata.day
    var userID = req.user._doc._id
    var woID = req.body.workoutID

    console.log(wodata)

    if(userID != req.body.userID){
        res.status(401).json({errorMessage: "Unauthorised Action by the user"})
    }


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
