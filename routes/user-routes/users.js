const router   = require('express').Router();
const User = require('../../models/user')
const { isAuth } = require('../authmiddleware'); 
const { genPassword } = require('../../lib/passwordUtils')
const passport = require('passport')


// routes


router.post('/add', (req, res, next) => {

    let saltHash = genPassword(req.body.password)
    let salt = saltHash.salt; 
    let hash = saltHash.hash;
    req.body.salt = salt
    req.body.hash = hash
    req.body.password = null

    let newUser = new User(req.body)

    console.log(newUser)
    
    newUser.save()   
    .then(response => {
        res.json({
            status: 1,
            response 
        })
    })

    .catch(error => {
        console.log(error)
        res.json({
            status: 0,
        })
    })
})

router.get('/', (req,res, next) => {
    User.find()
    .then(response => {
        var trimmedRes = response.map((item) => {
            item.hash = null
            item.salt = null
            return(item)
        })
        res.json({
            response: trimmedRes
        })
    })
    .catch(error => {
        console.log(error)
        res.status(404).json({
            message: 'An error Ocuured while fetching user details'
        })
    })
})

router.patch('/',(req,res) => {
    let conditions = { _id: req.body.id };
    
    User.findByIdAndUpdate(conditions, req.body.data, { new: true})
    .then((response) => {
        response.hash = null
        response.salt = null 
        res.json({
            response
        })
    })
    .catch(error => {
        console.log(error)
        res.json({
            response: "Failed to update"
        })
    })
})

router.delete('/', (req, res)=>{
    let conditions = { _id: req.body.id};
    User.findByIdAndDelete(conditions)
    .then((response) => {
        response.hash = null
        response.salt = null 
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