const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
	message: String,
    allUsers: Boolean,
    targetUsers: [{userID: String}],
    exceptUsers: [{userID: String}],
    closeable: Boolean,
    maxCloseNumber: Boolean, // Number of times user can close the message before the meassage is no longer shown - database wont store the number of times user have closed the message it will be recorded and manged locally.
    startDate: Date,
    endDate: Date, 
}, { timestamps : true })

const Message = mongoose.model('Media', messageSchema)
module.exports = Message
