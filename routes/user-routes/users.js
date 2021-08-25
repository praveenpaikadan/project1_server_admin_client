const router   = require('express').Router();
const User = require('../../models/user')
const { isAuth } = require('../authmiddleware'); 
const { genPassword } = require('../../lib/passwordUtils')
const passport = require('passport')


// routes

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