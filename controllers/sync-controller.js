const mongoose = require('moNgoose')
const WorkoutData = require('../models/workout-data')
const Transactions = require('../models/transaction-record')
const User = require('../models/user')



const getAllData = async (req) => {
    var userID = req.user._doc._id
    try{
        var credentials = await User.findOne({_id: userID}, {salt: 0, hash: 0})
        var workoutData = await WorkoutData.find({userID: userID}).sort('-createdAt')
    }catch{
        return false
    }

    return {credentials: credentials, workoutData: workoutData[0]?workoutData[0]:null}
}

module.exports = {getAllData}