
const mongoose = require('mongoose');

const UserSchema =  mongoose.Schema({
	name: String,
    email: String,
    verfied: {type: Boolean, default: false},
    hash: String, 
    salt: String,
    avatar : {},
	gender : String,
	dob : String,
	height : Number,
	weight : Number,
    workOutData : String,
    phone: String,
    weightHistory: [{date: Date, weight: Number}],
    currentWorkout: {
        programID: String, 
        workoutID: String,
        unlockedDays: Number, 
        // No total days is provided for flexibility of trainer to increase number of days if needed.
        planType: String,
        status: String, 
        currentPaymentBatchNo: Number,
        receiptID: String,
        reminder: Number
    },
    profilePhoto: {
        filename: String,
        secureUrl: String,
        meta: {}
    }
}, { timestamps : true})

const User = mongoose.model('user', UserSchema)

module.exports = User