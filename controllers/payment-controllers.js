const mongoose = require('mongoose')
const axios = require('axios')
const Receipt = require('../models/receipt')
const Program = require('../models/program')
const Razorpay = require('../config/payment')
const crypto = require('crypto');
const User = require('../models/user')
const WorkoutData = require('../models/workout-data')

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
            // console.log(error)
            return null
        }
    }

    async create_redate_validate_Receipt(existingReceipt){

        const createReceipt = async (receipt_id) => {

            this.programData = await Program.findOne({_id: this.originationData.programID})
                var paymentBatches = []
                function addDays(date, number) {
                    const newDate = new Date(date);
                    return new Date(newDate.setDate(newDate.getDate() + number));
                }
                
                let startDay = 0  // day in workout
                let reminder = 3 // remind 3 days before
    
                let plan = this.programData.subscriptionOptions.find(item => item._id == this.originationData.planID)
                let totalDays = this.programData.durationWeeks * this.programData.daysPerWeek
                let reccurence = plan.paymentReccurence
                if(plan.planType == 'Complete'){
                    reccurence = this.programData.durationWeeks * this.programData.daysPerWeek
                }
                
                // if(this.originationData.planType !== 'Complete'){
                    
                var no_batches = Math.round(totalDays/reccurence)

                for(let i =0; i<no_batches; i++){
                    let dueDay = startDay + (i*reccurence)
                    let expiryDay = dueDay + reccurence
                    let reminderDay = dueDay - reminder
                    let newEntry = {
                        batch: i,
                        dueDay: dueDay,
                        expiryDay: expiryDay,
                        currency: 'INR',
                        amount: plan['priceInRs'],
                        reminderDay: reminderDay,
                    } 

                    paymentBatches.push(newEntry)
                }
                // }else{
                //     paymentBatches.push({
                //         amount: plan['priceInRs'],
                //         batch: 0,
                //         currency: 'INR',
                //     })
                // }
    
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
    
                //
                if(receipt_id){

                    this.receipt = await Receipt.findOneAndUpdate({_id: receipt_id}, receipt, {new: true}) 
                    return this.receipt

                }
                //
                var receiptObj = new Receipt(receipt)
                this.receipt  = await receiptObj.save()
                return this.receipt
        }

        if(existingReceipt){
            if(existingReceipt.activeBatch === 0){ 
                // Not yet processed receipt for any payments.
                return await createReceipt(existingReceipt._id)
                //OR
                
                {/*
                try{
                    var a = new Date()
                    var searchParams  = existingReceipt._id;
                    var updateParams = {dateOfReceipt: new Date()};
                    // var existingReceipt = await Receipt.findByIdAndUpdate(searchParams, updateParams)
                    var existingReceipt = await Receipt.findOne(searchParams)
                    if(existingReceipt){
                        this.programData = await Program.findById(this.receipt.productID)
                    }
                    // updating already existing receipt with meta data other than ids.
                    receipt.userName = this.originationData.userName
                    receipt.userEmail =  this.originationData.userEmail
                    
                }catch(error){
                    console.log(error)
                    return null
                }
                */}


            }else if(existingReceipt.activeBatch === -1){
            // handle program complete, but payment request is made =======
            // check if the duration of program is extended by the trainer
            

            }else{
                // Renewal of subscription
                this.receipt = existingReceipt
                if(this.receipt){
                    this.programData = await Program.findById(this.receipt.productID)
                }
                return existingReceipt
            }

            return existingReceipt

        }else{
            // Very fresh request
            return await createReceipt()
        }
    }

    async createOrder(){



        // console.log('..... inside createOrder ..........', this.receipt)

        try{
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
            console.log('Failed To create order => ', error)
            return null
        }
    }


    getImageFile(){
        try{
            return this.programData.images[0].filename
        }catch(error){ 
            console.log(error)
            return null
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
          return response
    } 
}

async function returnReceiptIfExist(data){
    if(data.receiptID){
        var searchParams = {userID: data.userID, _id: data.receiptID}
    }else{
        var searchParams = {userID: data.userID, productID: data.programID, planID: data.planID}
    }
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
    // console.log('......', data)

    function createMessage(params){
        var verb = params.planType === 'Complete'?'subscribed to':'renewed subscription for';
        if(verb === 'renewed subscription for' && params.batchNo === 0){
            verb = 'subscribed to'
        }
        var message = 
        `<div>
        <p style="text-align: center;" class="success-message-p">You have successfully ${verb} ${params.productName} !!
        </p>
        <br /><br/>
        <p class="success-details-p">
            Amount Paid: Rs. ${params.amount} <br />
            Payment Id : ${params.payment_id} <br />
            Receipt Id: ${params.receipt_id}
        </p>
        </div>`
        return message
    }

    try{
        var secret = process.env.RAZORPAY_KEY_SECRET
        var batchNo = Number(data.batch)
        // batchNo actually refer to batchIndex
        var receipt = await Receipt.findOne({_id: data.receiptID})
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

            var message = createMessage({
                productName: receipt.productName,
                amount: batchUnderProcess.amount,
                receipt_id: receipt._id, 
                planType: receipt.planType, 
                batchNo: batchNo, 
                payment_id: payment_id,
                paymentStatus: receipt.paymentStatus
            })
            var returnValue = {verificationStatus: 'success', message: message, receipt: receipt, batchProcessed: batchNo}
            return returnValue
        }else{
            return ({verificationStatus: 'failed', message: 'Your payment verification has failed. Please redo the payment. Incase amount is deducted from your account, please wait till its refunded OR you contact us from trainer contact page.'})
        }
    }catch(error){
        console.log(error)
        return ({verificationStatus: 'error', message: 'Not able to verify your payment at the moment please contact trainer'})
    }
}

async function failedPaymentHandler(data){
    try{
        var searchParams = {_id: data.receiptID, "paymentBatches.orderResponse.id": data.metadata.order_id}
        var receipt = await Receipt.findOneAndUpdate(searchParams, { "$push": { 'paymentBatches.$.errorResponseHistory': data } })
    }catch(error){
        console.log(error)
    }
    return
}



module.exports = { Order, returnReceiptIfExist, successPaymentHandler, failedPaymentHandler}