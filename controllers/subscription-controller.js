const mongoose = require('mongoose')
const WorkoutData = require('../models/workout-data')
const Transactions = require('../models/receipt')
const User = require('../models/user')
const Program = require('../models/program')

const getAvailablePrograms = (req, res, next) => {
    // console.log(req)
    var userID = req.user._doc?req.user._doc._id:"1234"
    var name = req.user._doc.name
    console.log({_id: userID, name: name})

    const selectOptions = { active: 0, schedule: 0, 
        privetClients:0, meta: 0, "images.encoding": 0, 
        "images.mimetype":0, "images.fieldname":0, "images.size":0 ,
        createdAt: 0, updatedAt: 0, __v: 0, _id: 1
    }

    // Program.find().or([{active: true, type: true}, {active: true, type: false, privateClients: { $elemMatch: { _id: userID }}}])
    
    Program.find().or([{active: true, type: true}, { active: true, type: false, "privateClients.userID" :userID }])
    .select(selectOptions)
    .then(response => res.json(response))
    .catch(err => res.status(502).json({errorMessage: "Failed to get avialble programs for you"}))
}



module.exports = { getAvailablePrograms }