const mongoose = require('mongoose');
const exerciseSchema = mongoose.Schema({
	exerciseName : String,
    keyWords : {type: String, default: ''},
	instructions:[
        { 
            step : Number,
            description: String, 
        }
    ], 	
		   
	// images:[{}],
    coverImage: String,
    explainatoryImages: String,
    // video: [{}],
    videoEmbedString: String,
	// restInSec: Number,  
	repetitionType: String,
    active: Boolean,
    calsPerRep: Number,
    equipments: [String],

}, { timestamps : true})

const Exercise = mongoose.model('Exercise', exerciseSchema)
module.exports = Exercise
