const mongoose = require('moNgoose')
const WorkoutData = require('../models/workout-data')
const Transactions = require('../models/transaction-record')
const User = require('../models/user')
const Program = require('../models/program')

const getAvailablePrograms = (req, res, next) => {
    var userID = req.user._doc._id
    var name = req.user._doc.name
    console.log({_id: userID, name: name})

    

    const selectOptions = { active: 0, schedule: 0, 
        privetClients:0, videos:0, meta: 0, "images.encoding": 0, 
        "images.mimetype":0, "images.fieldname":0, "images.size":0 ,
        createdAt: 0, updatedAt: 0, __v: 0
    }

    // Program.find().or([{active: true, type: true}, {active: true, type: false, privateClients: { $elemMatch: { _id: userID }}}])
    
    Program.find().or([{active: true, type: true}, { active: true, type: false, "privateClients.userID" :userID }])
    .select(selectOptions)
    .then(response => res.json(response))
    .catch(err => res.json({errorMessage: "Failes to get avialbel programs for you"}))
}

const makeNewWorkoutData = (req, res, next) => {
    var userID = req.user._doc._id

    req.body = {
        programID: "612e5df23a016a43f48eb299",
        programName: "Muscle Build",
    }

    var newWorkoutData = new WorkoutData({
        programName: req.body.programName,
        programID: req.body.programID,
        userID: userID,

        // TBD => discuss and add start date and end date
        // startDate: String,
        // endDate: String,
        history:[]
    
    })
    newWorkoutData.save()
    .then(response => res.json(response))
    .catch(err => console.log(err))
}

module.exports = { makeNewWorkoutData, getAvailablePrograms }