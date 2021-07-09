const router   = require('express').Router();
const Program = require('../../models/program')

router.get('/', (req,res) => {
    Program.find()
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
    let program = Program({
        programName: req.body.programName,  
        coverImage: req.body.image,

    })
    program.save()   
    .then(response => {
        res.json({
            status: 1,
            response: 'Req saved'
        })
    })
    .catch(error => {
        res.json({
            status: 0,
        })
    })
})

module.exports = router