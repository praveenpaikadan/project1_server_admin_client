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
    imageUrl1: String,
    imageUrl2: String,
    video: [{}],
    videoEmbedString: String,
	// restInSec: Number,  
	repetitionType: String,
    active: Boolean,
    calsPerRep: Number,
    equipments: [String],

}, { timestamps : true})

const Exercise = mongoose.model('Exercise', exerciseSchema)
module.exports = Exercise
