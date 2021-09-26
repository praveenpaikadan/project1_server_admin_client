const Program = require('../models/program');
const WorkoutData = require('../models/workout-data')

getWorkoutData = async (req, res, next) => {
    var user = req.user._doc._id
    
    WorkoutData.findOne({"userID": user})
    .then(response => { 
        if(!response){
            req.workoutData = null
            next()
            return
        }
        var programID = response.programID 
        Program.findById(programID).select({meta: 0, createdAt: 0, goal: 0, otherRemarks: 0, subscriptionOptions: 0})
        .then(program => {
            if(program){
                response._doc.program = program._doc
                req.workoutData = response._doc
                next()
                return
            }else{
                // TBD => If program is not found
            }
        })
        .catch(err => {
            res.json(
                response
            )
        })
        
    })
    .catch(error => {
        // console.log(error)
        res.json({
            errorMessage: 'An error Ocuured while fetching workout details'
        })
    })
}


const makeNewWorkoutData = (req, res, next) => {
    var userID = req.user._doc._id


    // TBD => Make functions to check the user already have any subscription

    var newWorkoutData = new WorkoutData({
        programName: req.body.programName,
        programID: req.body.programID,
        planID: req.body.planID,
        userID: userID,
        history:[],
        currentDay: 1
        // TBD => discuss and add start date and end date
        // startDate: String,
        // endDate: String,
    })

    
    newWorkoutData.save()
    .then(response => {
        req.workoutData = response
        next()
    })
    .catch(err => {req.error = true; req.data = {error: err}} )

}

module.exports = {getWorkoutData, makeNewWorkoutData}