
const mongoose = require('mongoose');

const UserSchema =  mongoose.Schema({
	name: String,
    email: String,
    hash: String,
    salt: String,
    avatar : {},
	gender : String,
	dob : String,
	height : Number,
	weight : Number,
    workOutData : String,
    phone: String,
    profilePhoto: {}
}, { timestamps : true})

const User = mongoose.model('user', UserSchema)

module.exports = User