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
	image: [{}],
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
                description : String,
			    priceInRs : Number
            }
        ],
    images:[{}],
    video: [{}],
		 
}, { timestamps : true})

const Program = mongoose.model('Program', programSchema)

module.exports =  Program;