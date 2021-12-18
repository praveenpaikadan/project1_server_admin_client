const mongoose = require('mongoose');

const Receipt =  mongoose.Schema(
    {
        userID: String,
        userName: String,
        programName: String,
        programID: String,
        planName: String,
        planID: String,
        dateOfReceipt: Date,
        amountInINR: Number, 
        paid: Boolean,
    }, { timestamps : true}
)

const ReceiptModel = mongoose.model('Receipt', Receipt)

module.exports = ReceiptModel;