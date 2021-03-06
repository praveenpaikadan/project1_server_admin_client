const { getWorkoutData, calsPerRepObj } = require('../../controllers/workoutdata-controller');
const Program = require('../../models/program');
const { insertMany, deleteOne } = require('../../models/workout-data');
const WorkoutData = require('../../models/workout-data')
const router   = require('express').Router();
const Exercise = require('../../models/exercise')


router.get('/', getWorkoutData, (req, res) => {
    res.json(req.workoutData)
})

router.get('/exercise/:id', (req,res) => {
    Exercise.findOne({"_id": req.params.id})
    .then(response => {
        res.json(response)
    })
    .catch(error => {
        console.log(err)
        res.status(500).json({
            message: 'An error Ocuured while fetching excercise details'
        })
    })
})


router.get('/complete-history', (req,res) => {
    var userID = req.user._doc._id
    WorkoutData.find({userID: userID}).sort({startDate: "descending"})
    .then(response => {
        var programIDList  = response.map(item => item.programID)
        var wdList = JSON.parse(JSON.stringify(response))
        Program.find({_id:programIDList}).select({programName: 1, 'images.filename': 1, level: 1, goal: 1, daysPerWeek: 1, durationWeeks: 1, category: 1, 'schedule.targetBodyPart': 1, 'schedule.day': 1})
        .then((programsRes) => {
            var programs = JSON.parse(JSON.stringify(programsRes))
            calsPerRepObj()
            .then((calsPerRepObject) => {
                for(let i =0; i < response.length; i++){
                    wdList[i]['program'] = programs.find((item) => item._id === wdList[i]['programID'])
                    wdList[i]['calsPerRepList'] = calsPerRepObject?calsPerRepObject:{}
                }
                // console.log(wdList)
                res.json(wdList)
            })
            .catch(error => {
                console.log(error)
                res.status(500).json({
                    message: 'An error Ocuured while fetching details'
                })
            })
        })
        .catch(error => {
            console.log(error)
            res.status(500).json({
                message: 'An error Ocuured while fetching details'
            })
        })
        
    })
    .catch(error => {
        console.log(error)
        res.status(500).json({
            message: 'An error Ocuured while fetching details'
        })
    })
})


router.post('/initiate', (req, res) => {   // set starting date
    var data = req.body
    // console.log(data)
    userID = req.user._doc?req.user._doc._id:null
    WorkoutData.findOneAndUpdate({_id: data.workoutID, userID: userID}, {startDate: new Date()}, {new: true})
    .then((response) => {
        // console.log(response)
        if(response){
            res.json({status: 1, workoutData: response})  // success
        }else{
            res.json({status: 0}) // failed
        }
    })
    .catch(() => {
        res.json({status: -1}) // error
    })
})

// This route pushes a days workout to the workout history
router.post('/push', (req, res) => {
    var wodata = req.body.dayWorkoutData
    var day = wodata.day
    var woID = wodata.workoutID

    // console.log(wodata)


    // TBD => include functions to Examine recieved wodata then end or continue with request

    // WorkoutData.findOneAndUpdate({_id: woID, 'history.day': day}, { $set: { history: wodata } }, {new: true})
    // WorkoutData.findOneAndUpdate(conditions, update, {new: true})
    // WorkoutData.findOneAndUpdate({_id: woID, 'history.day': day}, wodata, {upsert: true, new: true})  
    
    

    // https://stackoverflow.com/questions/41888312/update-element-in-array-if-exists-else-insert-new-element-in-that-array-in-mongo


    // TBD || This is not an efficient method. research for a better one later already spend half a day on it.  --- DONE

    // WorkoutData.findOneAndUpdate(conditions, { '$pull': {'history': {day: day}}}, (() => 
    //     WorkoutData.findOneAndUpdate(conditions, {'$addToSet': {'history': wodata}}, {new: true})
    //     .then(result => {
    //         console.log(result)
    //         res.json(result)
    //     })
    //     .catch(err => console.log(err))
    //     ))


    // important => https://www.geeksforgeeks.org/mongodb-db-collection-bulkwrite-method/
    WorkoutData.bulkWrite([
        {
        updateOne:{
            filter: { _id: woID},
            update: { '$pull': {'history': {day: day}}}}
        },
        {
        updateOne:{
            filter: { _id: woID},
            update: {'$addToSet': {'history': wodata}}}
        }
        ], {ordered: true})

    .then(result => {
    // console.log(result)
    res.json(result)
    })
    .catch(err => console.log(err))
})


// This route delete a day's workout to the workout history
router.post('/delete-day', (req, res) => {

    var day = req.body.data.day
    var woID = req.body.data.workoutID
    var userID = req.user._doc?req.user._doc._id:"111111111111111111111111"

    WorkoutData.findOneAndUpdate( // select doc in moongo
        {_id: woID, userID: userID }, // your query, usually match by _id
        { $pull: { history: { day: day } } }, // item(s) to match from array you want to pull/remove
        { multi: false } // set this to true if you want to remove multiple elements.
    )
    .then(() => {
    res.status(200).json({message: 'success'})
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({errorMessage: 'Database Error'})
        })
})


router.post('/bulk', (req, res) => {            // handle pending uploads due to network error or server or database failure. The req data is an array of both data to be pushed to 
                                                // history and data to be removed from the history, which is differentiated by the key 'toDel'.
    // console.log(req.body.bulkDayWorkoutData)                                       
    var userID = req.user._doc?req.user._doc._id:"111111111111111111111111"
    var dataArray = req.body.bulkDayWorkoutData

    if(!dataArray[0]){
        res.status(400).end()
        return
    }
    var woID = dataArray[0].workoutID

    

    var allDays = dataArray.map((item) => item.day)
    var dataToPush = dataArray.filter(item => item.toDel !== 1)

    WorkoutData.bulkWrite([
        {
        updateOne:{
            filter: { _id: woID, userID: userID },
            update: { '$pull': {'history': {day: allDays}}}}
        },
        {
        updateOne:{
            filter: { _id: woID, userID: userID },
            update: {'$addToSet': {'history': dataToPush}}}
        }
        ], {ordered: true})

        .then(result => {res.json({result: result})})
        .catch(err => {console.log(err); res.status(500).end()})


    return
    // if(dataArray){
    //     dataArray.forEach(data => {
    //         var wodata = data
    //         var day = wodata.day
    //         var woID = wodata.workoutID

    //         console.log(wodata)


    //         if(wodata.toDel === 1 ){
    //             WorkoutData.findOneAndUpdate( // select your doc in moongo
    //                 {_id: woID, userID: userID }, // your query, usually match by _id
    //                 { $pull: { history: { day: day } } }, // item(s) to match from array you want to pull/remove
    //                 { multi: false } // set this to true if you want to remove multiple elements.
    //             )
    //             .then(() => {
    //                 return
    //             })
    //             .catch(err => {
    //                 console.log(err)
    //                 res.status(500).json({errorMessage: 'Database Error'})
    //                 return
    //                 })
    //             }

    //         WorkoutData.bulkWrite([
    //             {
    //             updateOne:{
    //                 filter: { _id: woID, userID: userID },
    //                 update: { '$pull': {'history': {day: day}}}}
    //             },
    //             {
    //             updateOne:{
    //                 filter: { _id: woID},
    //                 update: {'$addToSet': {'history': wodata}}}
    //             }
    //             ], {ordered: true})

    //             .then(result => {})
    //             .catch(err => console.log(err))
    //             res.end()
    //             return
    //             });
    // }else{
    //     res.status(400).json({message: 'Bad request'})
    // }
    // res.end() 
        
})



module.exports = router


