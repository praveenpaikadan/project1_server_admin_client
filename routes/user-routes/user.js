const router   = require('express').Router();
const User = require('../../models/user')
const { isAuth } = require('../authmiddleware'); 
const { genPassword } = require('../../lib/passwordUtils')
const passport = require('passport')


// routes

router.get('/data', (req, res) => {
    let userID = req.session.passport.user
    User.findOne({"_id": userID})
    .then((response) => {
        response.hash = null
        response.salt = null
        res.json({response})
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({response: "Failed"})
    })
})

router.patch('/data',(req,res) => {
    let userID = req.session.passport.user
    let conditions = { _id: userID };
    User.findByIdAndUpdate(conditions, req.body, { new: true})
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

module.exports = router