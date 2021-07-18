const router   = require('express').Router();
const Program = require('../../models/program')

// routes

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

router.post('/add', (req, res, next) => {
    console.log(req.body.programName)
    let program = new Program({
        programName: req.body.programName
    })

    program.save()   
    .then(response => {
        res.json({
            response
        })
    })
    .catch(error => {
        res.json({
            status: 0,
        })
    })
})

router.patch('/',(req,res) => {
    let conditions = { _id: req.body.id };
    
    Program.findByIdAndUpdate(conditions, req.body.data, { new: true})
    .then((response) => {
        res.json({
            response
        })
    })
    .catch(error => {
        console.log(err)
        res.json({
            response: "Failed to update"
        })
    })
})

router.delete('/', (req, res)=>{
    let conditions = { _id: req.body.id};
    Program.findByIdAndDelete(conditions)
    .then((response) => {
        res.json({
            response
        })
    })
    .catch(error => {
        console.log(err)
        res.json({
            response: "Failed to update"
        })
    })
})

module.exports = router