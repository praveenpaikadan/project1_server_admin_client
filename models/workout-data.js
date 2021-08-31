// workoutDataModel: {

//     const mongoose = require('mongoose');

//     const workoutDataSchema =  mongoose.Schema({
//         ProgramList:[{
//             program: ObjectId,
//             uniqueProgramKey : String,
//             planType: String ,
//             status: String,
//             lastDay: Number
//             }],
    
//             history:[{
//                 uniqueProgramKey: String,
//                 exerciseHistory:[{
//                 day: Number,
//                 exercises:[ObjectId]
//             }]
//         }]
//         }, { timestamps : true})
    
//     const WorkoutData = mongoose.model('workoutData', workoutDataSchema)
    
//     module.exports = WorkoutData    
    
    
    
    

//     ProgramList:[{
//         program: ObjectID(programDataModel)
//         uniqueProgramKey : String
//         planType: String 
//         status: String
//         lastDay: Number
//     }]

//     history:[{
//         uniqueProgramKey: String
//         exerciseHistory:[{
//             day: Number,
//             exercises:[ObjectID(exerciseInstanceModel)
//         }]
//     }]
// 	}
