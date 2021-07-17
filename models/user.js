
const mongoose = require('mongoose');

const UserSchema =  mongoose.Schema({
	Auth : {
        email: String,
        password : String,
        lastLoginTime : String,  
    },
	name : String,
    avatar : Buffer,
	gender : String,
	dob : String,
	height : Number,
	weight : Number,
    workOutData : String,
}, { timestamps : true})

const User = mongoose.model('user', UserSchema)

module.exports = User