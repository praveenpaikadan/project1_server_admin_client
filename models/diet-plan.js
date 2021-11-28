const mongoose = require('mongoose');
const dietPlanSchema = mongoose.Schema({
	planName : String,
	description: String,
    client: {userID: String, userName: String, programID: String, programName: String},
    dietPlan: [{
        day: Number, 
        target: [{
            param: String,
            min: Number,
            max: Number,
            unit: String,
        }],
        plan: [{
            title:String,
            time: Number,
            contents: [String]
        }]
    }],
    active: Boolean

}, { timestamps : true})

const DietPlan = mongoose.model('Exercise', dietPlanSchema)
module.exports = DietPlan
