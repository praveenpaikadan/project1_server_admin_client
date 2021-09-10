const mongoose = require('mongoose');

const transactionRecord =  mongoose.Schema(
    {
        userID: mongoose.Schema.Types.ObjectId,
        userName: String,
        programID:  mongoose.Schema.Types.ObjectId,
        amountInINR: Number,
        date: Date,  
    }, { timestamps : true}
)

const Transactions = mongoose.model('Transactions', transactionRecord)

module.exports = Transactions;