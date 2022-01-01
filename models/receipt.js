const mongoose = require('mongoose');

const Receipt =  mongoose.Schema(
    {
        userID: String,
        userName: String,
        userEmail: String,
        productName: String,
        productID: String,
        planName: String,
        planID: String,
        dateOfReceipt: Date,
        planType: String,
        startDate: Date,
        paymentStatus: {type: String, default: 'fresh'},
        activeBatch: {type: Number, default: 0},
        paymentBatches: [{
            amount: Number,
            batch: Number,
            orderRequest: {},
            orderResponse: {},
            successResponse: {},
            errorResponseHistory:[{}],
            currency: String,
            reminderDate: Date,
            dueDate: Date,
        }],
    }, { timestamps : true}
)

const ReceiptModel = mongoose.model('Receipt', Receipt)

module.exports = ReceiptModel;