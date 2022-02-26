const Program = require('../models/program');
const Exercise = require('../models/exercise')
const WorkoutData = require('../models/workout-data');
const User = require('../models/user');
const DietPlan = require('../models/diet-plan');

calsPerRepObj = async () => {
    try{
        returnVal = {}
        var list = await Exercise.find({}, {_id: 1, calsPerRep: 1})
        for (var i=0; i<list.length; i++){returnVal[list[i]['_id']] = list[i]['calsPerRep']}
        return returnVal
    }catch{
        return false
    }  
}


getWorkoutData = async (req, res, next) => {
    var user = req.user._doc._id
    var workoutID = req.user._doc.currentWorkout?req.user._doc.currentWorkout.workoutID:undefined

    // console.log(workoutID)
    
    WorkoutData.findOne({_id: workoutID})
    .then(response => { 
        if(!response){
            req.workoutData = null
            next()
            return
        }
        
        var programID = response.programID 
        Program.findById(programID).select({meta: 0, createdAt: 0, goal: 0, otherRemarks: 0, subscriptionOptions: 0})
        .then(async program => {
            if(program){
                response._doc.program = program._doc
                var calsPerRepList = await calsPerRepObj()
                response._doc.calsPerRepList = calsPerRepList
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

const handleSuccesfulSubscription = async (receipt, batchProcessed) => {
    
    if(batchProcessed === 0){

        var user = await User.findOne({_id: receipt.userID})

        var newWorkoutData = new WorkoutData({
            programName: receipt.productName,
            programID: receipt.productID,
            planID: receipt.planID,
            userID: user._id,
            history:[],
            currentDay: 1
        })

        newWorkoutData = await newWorkoutData.save()

        // var dietPlan = await DietPlan.findOne({"client.userID": user._id, "client.programID": user.programID })
        var currentWorkout = {
            programID: receipt.productID,
            workoutID: newWorkoutData._id,
            receiptID: receipt._id,
            planType: receipt.planType,
            status: 'active',
            unlockedDays: receipt.paymentBatches.find((item) => item.batch == batchProcessed)['expiryDay'],
            reminder: 3,
        }

        // console.log(currentWorkout)
        user.currentWorkout = currentWorkout
        var updatedUser = await user.save()
    }else{
        var user = await User.findOne({_id: receipt.userID})
        user.currentWorkout.status = 'active'
        user.currentWorkout.unlockedDays =  receipt.paymentBatches.find((item) => item.batch == batchProcessed)['expiryDay']
        // console.log(user.currentWorkout)
        var updatedUser = await user.save()
    }
}

module.exports = {getWorkoutData, makeNewWorkoutData, handleSuccesfulSubscription, calsPerRepObj}