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
	equipment : [String],
	schedule : 
		[   
            { 
                day : Number,
                exercises : 
                    [
                        {
                            exerciseID : String,
                            exerciseName : String,
                            weightInKg: Number,
                            restInSec : Number,
                            target: Number ,
                        }
                    ],
            }
        ],
        	
	subscriptionOptions : 
        [
            {    
                planType : String, 
                description : String,
			    priceInRs : Number
            }
        ],
    images:[{}],
    videos: [{}],
    active: Boolean,
    type: Boolean,  // public = true, privet = false
    privateClients: [{}],
		 
}, { timestamps : true})

const Program = mongoose.model('Program', programSchema)

module.exports =  Program;