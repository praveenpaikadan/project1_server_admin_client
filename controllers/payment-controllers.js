const mongoose = require('mongoose')
const axios = require('axios')
const Receipt = require('../models/receipt')
const Program = require('../models/program')
const Razorpay = require('../config/payment')
const crypto = require('crypto');


class Order{

    constructor(data){
        this.originationData = data
    }   

    async retreiveOrderDetails(){
        try{
            var active = this.receipt.activeBatch
            var response = await Razorpay.orders.fetch(this.receipt.paymentBatches[active].orderResponse.id)
            return response
        }catch(error){
            console.log(error)
            return null
        }
    }

    async createReceipt(existingReceipt){
        if(existingReceipt){
            if(existingReceipt.activeBatch === 0){ 
                try{
                    var a = new Date()
                    var searchParams  = existingReceipt._id;
                    var updateParams = {dateOfReceipt: new Date()};
                    console.log(searchParams, updateParams)
                    var existingReceipt = await Receipt.findByIdAndUpdate(searchParams, updateParams )
                    this.receipt = existingReceipt;
                    if(this.receipt){
                        this.programData = await Program.findById(this.receipt.productID)
                    }
                }catch(error){
                    console.log(error)
                    return null
                }
            }
            return existingReceipt

        }else{
            this.programData = await Program.findOne({_id: this.originationData.programID})
            var paymentBatches = []
            function addDays(date, number) {
                const newDate = new Date(date);
                return new Date(newDate.setDate(newDate.getDate() + number));
            }
            
            let startdate = new Date('12-20-2021') 
            let reminder = 3 // remind 3 days before

            // functions to check if receipt is already made goes here.

            let plan = this.programData.subscriptionOptions.find(item => item._id == this.originationData.planID)
            
            if(this.originationData.planType === 'Monthly'){
                
                var no_batches = Math.round(this.programData.durationWeeks/4)
                for(let i =0; i<no_batches; i++){
                    let dueDate = addDays(startdate, i*30)
                    let reminderDate = addDays(dueDate, reminder-1)
                    let newEntry = {
                        batch: i,
                        dueDate: dueDate,
                        currency: 'INR',
                        amount: plan['priceInRs'],
                        reminderDate: reminderDate,
                    } 
                    paymentBatches.push(newEntry)
                }
            }else if(this.originationData.planType === 'Complete'){
                paymentBatches.push({
                    amount: plan['priceInRs'],
                    batch: 0,
                    currency: 'INR',
                    dueDate: startdate,
                })
            }

            var receipt = {
                userID: this.originationData.userID,
                userName: this.originationData.userName,
                userEmail: this.originationData.userEmail,
                productName: this.originationData.programName,
                productID: this.originationData.programID,
                planName: this.originationData.planType,
                planID: this.originationData.planID,
                activeBatch: 0,
                dateOfReceipt: new Date(),
                planType: this.originationData.planType,
                startdate: this.originationData.startDate,
                paymentBatches: paymentBatches
            }
            var receiptObj = new Receipt(receipt)
            this.receipt  = await receiptObj.save()
            return this.receipt
        }
    }

    async createOrder(){
        var activeBatch = this.receipt.paymentBatches[this.receipt.activeBatch]
        var request = {
            "amount":activeBatch.amount*100,  // for razor pay the amount should be in paisa
            "currency":activeBatch.currency,
            "receipt":`${this.receipt._id}_${activeBatch.batch}`,
            "notes":{
                paidByUser: this.receipt.userName,
                paidByEmail: this.receipt.userEmail,
                productName: this.receipt.productName,
                productID: this.receipt.productID,
                totalBatches: this.receipt.paymentBatches.length,
                planType: this.receipt.planType,
                batch: this.receipt.activeBatch,
            }
        }

        try{
            var response  = await Razorpay.orders.create(request)
            if(response.id){
                var receiptID = this.receipt._id
                // this.receipt.paymentBatches[batchUnderProcess] = {...this.receipt.paymentBatches[batchUnderProcess], order_id: orderDetails.order_id}
                var batchUnderProcess = this.receipt.activeBatch
                var renewedReceipt = await Receipt.findOneAndUpdate({_id: receiptID, "paymentBatches.batch": batchUnderProcess},{'$set': {
                    'paymentBatches.$.orderRequest': request,
                    'paymentBatches.$.orderResponse': response
                }})
                this.receipt = renewedReceipt
                return response
            }else{
                return null
            }
        }catch(error){
            console.log(error)
            return null
        }
    }


    getImageFile(){
        try{
            return this.programData.images[0].filename
        }catch(error){
            return null
            console.log(error)
        }
        
    }
    // not in use
    async createRPPlan(){    
        let plan = this.programData.subscriptionOptions.find(item => item._id == this.originationData.planID)
        var activeBatch = this.receipt.paymentBatches.find(item => item.activeBatch === true)    
        var payload = {
            period: "monthly",
            interval: 1,
            item: {
              name: `${this.receipt.productName}-Monthly`,
              amount: plan['priceInRs'],
              currency: "INR",
              description: this.receipt.productName,
            },
            "notes":{
                productName: this.receipt.productName,
                productID: this.receipt.productID,
                planType: this.receipt.planType,
                noOfBatches: this.receipt.paymentBatches.length,
            }
          }

        var response = await Razorpay.plans.create(payload)
        return response
    }

    // not in use
    async createSubscription(plan){
        var response = await Razorpay.subscriptions.create({
            plan_id: plan.plan_id,
            customer_notify: 1,
            quantity: 1,
            total_count: plan.notes.noOfBatches,
            start_at: this.originationData.startDate.timeStamp(),
            addons: [],
            notes: {
                paidByUser: this.originationData.userName,
                paidByEmail: this.originationData.userEmail,
                productName: this.receipt.productName,
                productID: this.receipt.productID,
                planType: this.receipt.planType
            }
          })
          console.log(response)
          return response
    } 
}

async function returnReceiptIfExist(data){
    var searchParams = {userID: data.userID, productID: data.programID, planID: data.planID}
    try{
        var response  = await Receipt.findOne(searchParams)
        if (response === []){
            return null
        }else{
            return response
        }
    }catch(error){
        return null
    }
}

async function successPaymentHandler(data){
    function createMessage(params){
        var verb = params.planType === 'Complete'?'subscribed to':'renewed subscription for';
        if(verb === 'renewed subscription for' && params.batchNo === 0){
            verb = 'subscribed to'
        }
        var message = 
        `You have successfully ${verb} ${params.productName}
        <br /><br/>
        Amount Paid: Rs. ${params.amount} <br /><br/>
        Payment Id : ${params.payment_id} <br /><br/>
        Receipt Id: ${params.receipt_id}`
        return message
    }

    try{
        var secret = "XwWBs3w2eeRFdLmOfTXNHIZJ"
        var batchNo = Number(data.batch)
        // batchNo actually refer to batchIndex
        var receipt = await Receipt.findOne({_id: data.receiptID})
        console.log(receipt)
        var batchUnderProcess = receipt.paymentBatches.find(item => item.batch === batchNo)
        var order_id = batchUnderProcess.orderResponse.id
        var payment_id = data.rpResponse.razorpay_payment_id
        var hmac =crypto.createHmac('sha256', secret)
        hmac.update(order_id + "|" + payment_id)
        var generated_signature = hmac.digest('hex');
        var received_signature = data.rpResponse.razorpay_signature
        if(received_signature === generated_signature){
            batchUnderProcess.successResponse = data.rpResponse
            receipt.paymentBatches[batchNo] = batchUnderProcess
            if(receipt.paymentBatches.length-1 === batchNo){
                receipt.paymentStatus = 'complete'
                receipt.activeBatch = -1
            }else{
                receipt.paymentStatus = 'partial'
                receipt.activeBatch = batchNo + 1
            }  
            var receipt = await Receipt.findByIdAndUpdate(data.receiptID, receipt)
            console.log(receipt)

            // all changes regrading subscription goes here







            // ---------------------------------------------

            var message = createMessage({
                productName: receipt.productName,
                amount: batchUnderProcess.amount,
                receipt_id: receipt._id, 
                planType: receipt.planType, 
                batchNo: batchNo, 
                payment_id: payment_id,
                paymentStatus: receipt.paymentStatus
            })
            return ({verificationStatus: 'success', message: message})
        }else{
            return ({verificationStatus: 'failed', message: 'Your payment verification has failed. Please redo the payment. Incase amount is deducted from the account, please contact us from trainer contact page.'})
        }
    }catch(error){
        console.log(error)
        return ({verificationStatus: 'error'})
    }
}

async function failedPaymentHandler(data){
    return
}



module.exports = { Order, returnReceiptIfExist, successPaymentHandler }