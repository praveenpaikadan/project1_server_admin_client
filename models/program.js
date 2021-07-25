const mongoose = require('mongoose')
const programSchema = mongoose.Schema({
    meta : {
        dateCreated:String,
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
	coverImage: String,
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
                            reps : Number,
                            weightInKg: Number,
                            restInSec : Number,
                            target: Number ,
                        }
                    ],
            }
        ],
        	
	subscription : 
        [
            {    
                planType : String,
                Description : String,
			    PriceInRs : Number
            }
        ]
		 
}, { timestamps : true})

const Program = mongoose.model('Program', programSchema)

module.exports =  Program;