const mongoose = require('mongoose');

const workoutDataSchema =  mongoose.Schema({
        programID: mongoose.Schema.Types.ObjectId,
        userID: mongoose.Schema.Types.ObjectId,
        startDate: String,
        endDate: String,
        currentDay: Number,
        history:[{
                ref: {type: String, default: 'dayInst'},
                day: Number,
                date:String,
                exercises:[{
                    ref: {type: String, default: 'exInst'},
                    exerciseNumber: Number,
                    exerciseID: mongoose.Schema.Types.ObjectId,
                    exerciseName: String,
                    reps: [String],
                    repetitionType: String
            }]
        }]
    }, { timestamps : true})

const WorkoutData = mongoose.model('WorkoutData', workoutDataSchema)

module.exports = WorkoutData;