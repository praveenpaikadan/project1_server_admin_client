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
    keyWords: {type: String, default: ''}, 
	durationWeeks : Number,
	daysPerWeek : Number,
	level : String,
	goal: String,  
    productDescription: String,                  
    category: String,
	equipments : [String],
    generalInstructions: String,
	schedule : 
		[   
            { 
                day : Number,
                dayIntroVideoEmbedString: String,
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
                            repetitionType: String,
                            restAfterInMins: Number
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
    coverImage: String,
    videoEmbedString: String,
    active: Boolean,
    type: Boolean,  // public = true, privet = false
    privateClients: [{userID: String,  name: String}],
    otherRemarks: String,
		 
}, { timestamps : true})

const Program = mongoose.model('Program', programSchema)

module.exports =  Program;