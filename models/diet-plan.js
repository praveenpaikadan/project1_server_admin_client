const mongoose = require('mongoose');
const dietPlanSchema = mongoose.Schema({
	planName : String,
    keyWords : {type: String, default: ''},
	description: String,
    water: Number,
    ss: {type: Boolean, default: false},
    client: {userID: String, userName: String, email: String, programID: String, programName: String},
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
            contents: [{content: String}]
        }]
    }],
    active: Boolean

}, { timestamps : true})

const DietPlan = mongoose.model('DietPlan', dietPlanSchema)
module.exports = DietPlan
