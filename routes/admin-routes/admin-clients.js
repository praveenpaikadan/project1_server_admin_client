const router   = require('express').Router();
const User = require('../../models/user');
const multer = require('multer');
const {upload} = require('../../config/multer');
const Program = require('../../models/program');
const WorkoutData = require('../../models/workout-data');

// const fs = require('fs');

// routes

// const getMediaUrl = (filename) => {
//     let sep =  __dirname.includes('/')?'/':"\\"
//     let url = __dirname.split(sep)
//     url.pop()
//     url.pop()
//     return ([...url, 'static', 'media', filename].join(sep))
// }

// const deleteFiles = (files) => {
//     files.forEach(file => {
//         var mpath = getMediaUrl(file)
//         if (fs.existsSync(mpath)){
//             console.log(mpath)
//             fs.unlink(mpath, err => {
//                 if (err) {
//                     console.log('Failed to delete :' + mpath)
//                 }else{
//                     console.log('File Deleted : ' + mpath) 
//                 };
//             });
//         }
//     });
//     return true
// }

// const getFilesToBeDeleted = async (id, contents) => {
//     let program = await Program.findById(id)
//     filesNamesToBeDeleted = []
//     for (content of contents) {
//         if (content !== null){
//             filesNamesToBeDeleted = [...filesNamesToBeDeleted, ...program[content].map(item => item.filename)]
//         }
//       }
//     return filesNamesToBeDeleted
// }


// // routes
// router.get('/:id', (req,res) => {
//     console.log(req.params.id)
//     // if there is no item null is returned.
//     Program.findOne({"_id": req.params.id})
//     .then(response => {
//         res.json({
//             response
//         })
//     })
//     .catch(error => {
//         console.log(err)
//         res.json({
//             response: 'An error Ocuured while fetching excercise details'
//         })
//     })
// })

// keep this route always above
router.get('/overview', (req,res) => {
    // .lean() will return plain JS object rather that mangoose doc object
    User.find().select({hash:0, salt: 0}).sort("name").lean()
    .then(fetchedData => {
        Program.find().select({schedule: 0, goal: 0, images: 0, videos: 0, subscriptionOptions:0, equipments: 0, meta: 0}).sort({updatedAt: "descending"})
        .then(programArray => {
            WorkoutData.find().select({history: 0 }).sort({updatedAt: "descending"})
            .then(workoutDataArray => {
                var formatted = fetchedData.map((user, index) => {
                    let currentWorkout = user.currentWorkout
                    // doc._id return mangoose id object doc.id return id in string
                    let currentProgram = programArray.find( program =>  program.id === (currentWorkout?currentWorkout.programID:null))
                    let currentWorkoutData = workoutDataArray.find(workout => workout.id === (currentWorkout?currentWorkout.workoutID:null))
                    user.currentProgram = currentProgram? currentProgram['programName']: null
                    user.programType = currentProgram? (currentProgram['type']?'Public':'Custom'): null
                    user.keyWords = user.name + ' ('+user.email+')'
                    user.lastDateTracked = currentWorkoutData? new Date(currentWorkoutData['updatedAt']).toDateString(): null
                    user.unlockedDays = user.currentWorkout? user.currentWorkout['unlockedDays']: null
                    user.totalDays = currentProgram? (currentProgram['durationWeeks'] * currentProgram['daysPerWeek']) : null
                    user.programStatus = (user.unlockedDays?user.unlockedDays: '-') + '/' + (user.totalDays?user.totalDays:'-')  
                    return user
                })
                res.json(formatted)
            })
            .catch(error => {
                console.log(error)
                res.json({
                    error: 'An error Ocuured while fetching workout details'
                })
            })
        })
        .catch(error => {
            console.log(error)
            res.json({
                error: 'An error Ocuured while fetching program details'
            })
        })
    })
    .catch(error => {
        console.log(err)
        res.json({
            response: 'An error Ocuured while fetching excercise details'
        })
    })
})


router.get('/:id', (req,res) => {

    User.findById(req.params.id).select({hash:0, salt: 0}).sort("name")
    .then(response => {
        res.json(response)
    })
    .catch(error => {
        console.log(error)
        res.json({
            response: 'An error Ocuured while fetching excercise details'
        })
    })
})


router.get('/', (req,res) => {
    User.find().select({hash:0, salt: 0}).sort("name")
    .then(response => {
        res.json(response)
    })
    .catch(error => {
        console.log(err)
        res.json({
            response: 'An error Ocuured while fetching excercise details'
        })
    })
})


// not complete -not in use--------------
router.get('/assigned-programs/:id', (req,res) => {
    var userID = req.params['id']

    const selectOptions = { active: 1, _id:1, programName: 1 }

    // Program.find().or([{active: true, type: true}, {active: true, type: false, privateClients: { $elemMatch: { _id: userID }}}])
    
    Program.find().or([{type: true}, {type: false, "privateClients.userID" :userID }])
    .select(selectOptions)
    .then(response => res.json(response))
    .catch(err => res.status(502).json({errorMessage: "Failed to get avialble programs for you"}))
})

// router.post('/',

//     upload.fields([{
//         name: 'images', maxCount: 1
//         }, {
//         name: 'videos', maxCount: 1
//         }]) ,
    
//     (req, res) => {
//         console.log(req.body)
//         var data = JSON.parse(req.body.data)
        
//         data.images = req.files.images
//         data.videos = req.files.videos
        
//         console.log(data)

//         let program = new Program(data)

//         program.save()   
//         .then(response => {
//             res.json({
//                 response
//             })
//         })
//         .catch(error => {
//             console.log('failed')
//             res.status(500).json({
//                 response: "Failed"
//             })
//         })
// });

// router.patch('/',

//     upload.fields([{
//         name: 'images', maxCount: 1
//         }, {
//         name: 'videos', maxCount: 1
//         }]) ,


//     (req,res) => {
        

//         var data = JSON.parse(req.body.data)
//         var id = req.body.id
//         if(req.files.images){
//             var image1 = req.files.images[0];
//             data.images = [image1];
//         }

//         if(req.files.videos){
//             var video = req.files.video[0];
//             data.videos = [video];
//         }

//         let conditions = { _id: id };
//         getFilesToBeDeleted(data.id, [data.images?'images':null, data.videos?'videos':null])
//         .then((filesNamesToBeDeleted => {
//             Program.findByIdAndUpdate(conditions, data, { new: true})
//             .then((response) => {
//                 deleteFiles(filesNamesToBeDeleted)
//                 res.json({
//                     response
//                 })
//             })
    
//             .catch(err => {
//                 console.log(err)
//                 res.status(400).json({
//                     response: "Failed to update"
//                 })
//             })
                
//         }))
// });

// router.delete('/:id', (req, res, next)=>{
//     let id = req.params.id
//     getFilesToBeDeleted(id, ['images', 'videos'])
//     .then(filesNamesToBeDeleted => {
//         Program.findByIdAndDelete(id)
//         .then((response) => {
//             deleteFiles(filesNamesToBeDeleted);
//             res.json({
//                 response
//             })
//         })
//         .catch(error => {
//             console.log(err)
//             res.json({
//                 response: "Failed to update"
//             })
//         })
//     })
//     .catch(err => {
//         console.log(err)
//         res.status(404).json({
//             response: null,
//             message: "No Item found"
//         })
//     })
// })

module.exports = router