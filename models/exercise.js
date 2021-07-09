const mongoose = require('mongoose');
const exerciseSchema = mongoose.Schema({
    exeriseID: Number,
	exerciseName : String,
	instructions:[
        { 
            step : Number,
            description: String, 
        }
    ], 	
		   
	images:[
        {imageUrl: String}
    ],

	restInSec: Number,  
	repetitionType: String,

}, { timestamps : true})

const Exercise = mongoose.model('Exercise', exerciseSchema)

module.exports = Exercise
