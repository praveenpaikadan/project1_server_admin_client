const mongoose = require('mongoose');
const emailCode = mongoose.Schema({
	email : String,
	hash: String,
	salt: String,
    expiry: Number,
})

const EmailCode = mongoose.model('EmailCode', emailCode)
module.exports = EmailCode
