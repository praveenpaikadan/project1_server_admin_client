
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
    currentWorkout: {
        programID: String, 
        workoutID: String, 
        planType: String,
        status: String, 
        currentPaymentBatchNo: Number,
        receiptID: String,
    },
    profilePhoto: {}
}, { timestamps : true})

const User = mongoose.model('user', UserSchema)

module.exports = User