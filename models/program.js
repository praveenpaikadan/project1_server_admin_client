const mongoose = require('mongoose')
const programSchema = mongoose.Schema({
    meta : {
        subscribers:[String],
        feedbacks:[
            {
                feedbackDate: String,
                subscriber : String,
                review: String,
                rating: Number,
            }
        ]
    },

	programName: String,  
	durationWeeks : Number,
	daysPerWeek : Number,
	level : String,
	goal: String,  
    productDescription: String,                  
    category: String,
	equipments : [String],
	schedule : 
		[   
            { 
                day : Number,
                timeInMins: Number,
                targetBodyPart: String,
                exercises : 
                    [
                        {
                            exerciseID : String,
                            exerciseName : String,
                            weightInKg: Number,
                            restInSec : Number,
                            target: [],  
                            repetitionType: String
                        }
                    ],
            }
        ],
        	
	subscriptionOptions : 
        [
            {    
                planType : String, 
                description : String,
			    priceInRs : Number,
                paymentReccurence: Number,
                forceLock: Boolean
            }
        ],
    images:[{}],
    videos: [{}],
    active: Boolean,
    type: Boolean,  // public = true, privet = false
    privateClients: [{userID: String,  name: String}],
    otherRemarks: String,
		 
}, { timestamps : true})

const Program = mongoose.model('Program', programSchema)

module.exports =  Program;