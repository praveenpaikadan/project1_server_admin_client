const mongoose = require('mongoose');

const workoutDataSchema =  mongoose.Schema({
        programName: String,
        programID: mongoose.Schema.Types.ObjectId,
        userID: mongoose.Schema.Types.ObjectId,
        startDate: String,
        endDate: String,
        history:[{
                ref: {type: String, default: 'dayInst'},
                day: Number,
                time:String,
                exercises:[{
                    ref: {type: String, default: 'exInst'},
                    exerciseNumber: Number,
                    exerciseID: mongoose.Schema.Types.ObjectId,
                    reps: [String],
                    repetitionType: String
            }]
        }]
    }, { timestamps : true})

const WorkoutData = mongoose.model('WorkoutData', workoutDataSchema)

module.exports = WorkoutData;