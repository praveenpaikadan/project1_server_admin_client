const mongoose = require('mongoose');
const exerciseSchema = mongoose.Schema({
	exerciseName : String,
	instructions:[
        { 
            step : Number,
            description: String, 
        }
    ], 	
		   
	images:[{}],
    video: [{}],

	restInSec: Number,  
	repetitionType: String,
    active: Boolean,
    equipments: [String],

}, { timestamps : true})

const Exercise = mongoose.model('Exercise', exerciseSchema)
module.exports = Exercise
