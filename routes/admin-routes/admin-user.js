const router   = require('express').Router();
const AdminUser = require('../../models/admin-user')


router.get('/', (req,res) => {
    AdminUser.find()
    .then(response => {
        res.json({
            response
        })
    })
    .catch(error => {
        console.log(err)
        res.json({
            message: 'An error Ocuured while fetching excercise details'
        })
    })
})

router.post('/', (req, res, next) => {
    console.log(req.body)
    let adminUser = new Program({
        programName: req.body.programName,  
        coverImage: String,
        durationWeeks : Number,
        daysPerWeek : Number,
        level : String,
        goal: String,
        equipment : [String],
        schedule : 
            [   
                { 
                    day : Number,
                    exercises : 
                        [
                            {
                                exerciseID : String,
                                reps : Number,
                                weightInKg: Number,
                                restInSec : Number,
                                target: Number ,
                            }
                        ],
                }
            ],	
        subscription : 
            [
                {    
                    planType : String,
                    Description : String,
                    PriceInRs : Number
                }
            ]
             
    })

    adminUser.save()   
    .then(response => {
        res.json({
            status: 1,
            response 
        })
    })
    .catch(error => {
        res.json({
            status: 0,
        })
    })
})

module.exports = router