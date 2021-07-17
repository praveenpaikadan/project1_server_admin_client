const router   = require('express').Router();
const User = require('../../models/user')

const validate = (req, res, next) => {
    let valid = true 
    // validators go here
    
    if (valid){
        next()
    }else{
        res.json({
            response: "Operation failed"
        })
    }
}


// routes

router.use('/', validate)

router.get('/', (req,res) => {
    User.find()
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
    let user = new User({
        name: req.body.name,
    })

    user.save()   
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

router.patch('/',(req,res) => {
    let conditions = { _id: req.body.id };
    
    User.findByIdAndUpdate(conditions, req.body.data, { new: true})
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
    User.findByIdAndDelete(conditions)
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