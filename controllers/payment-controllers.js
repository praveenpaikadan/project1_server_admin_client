const mongoose = require('mongoose')
const axios = require('axios')
const Receipt = require('../models/receipt')
const Program = require('../models/program')


class Order{
    constructor(data){
        this.originationData = data

    }

    async createReceipt(){

        programData = await Program.findOne({_id: this.originationData.programID})
        
        var paymentBatches = []

        function addDays(date, number) {
            const newDate = new Date(date);
            return new Date(newDate.setDate(newDate.getDate() + number));
        }
        
        let startdate = new Date('12-20-2021') 
        let reminder = 3 // remind 3 days before
         
        if(this.originationData.planType === 'Monthly'){
            var no_batches = Math.round(programData.durationWeeks/4)
            for(i in no_batches){
                let dueDate = addDays(startdate, i*28)
                let reminderDate = addDays(dueDate, reminder-1)
                let newEntry = {
                    batch: i,
                    dueDate: dueDate,
                    amount: programData.subscriptionOptions.find(item => item._id === this.originationData.planID),
                    reminderDate: reminderDate,
                } 
                paymentBatches.push(newEntry)
            }
        }else if(this.originationData.planType === 'Complete'){
            paymentBatches.push({
                amount: programData.subscriptionOptions.find(item => item._id === this.originationData.planID),
                batch: i,
                dueDate: startdate,
            })
        }

        var receipt = {
            userID: this.originationData.userID,
            userName: this.originationData.userName,
            programName: this.originationData.programName,
            programID: this.originationData.programID,
            planName: this.originationData.planType,
            planID: this.originationData.planID,
            dateOfReceipt: new Date(),
            amountInINR: this.amount, 
            paymentBatches: paymentBatches
        }

        var receiptObj = new Receipt(receipt)
        var DBResponse = await receiptObj.save()
        return DBResponse
    }

    async create(){

        var data = {
            "amount":this.originationData.amount,
            "currency":this.currency,
            "receipt":this.originationData.receipt,
            "notes":this.notes
        };
        
        var config = {
        method: 'post',
        url: 'https://api.razorpay.com/v1/orders',
        headers: { 
            'Authorization': 'Basic cnpwX3Rlc3RfWHZsZ29PTDBXRldFZm46WHdXQnMzdzJlZVJGZExtT2ZUWE5ISVpK', 
            'Content-Type': 'application/json'
        },
        data : data
        };

        try{
            var rpResponse  = await axios(config)
            if(rpResponse.status === 200){
                return rpResponse.data
            }else{
                return null
            }
        }catch(error){
            error.data
            return null
        }
        
    }
}




module.exports = { Order }