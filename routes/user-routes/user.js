const router   = require('express').Router();
const User = require('../../models/user')
const { getWorkoutData } = require('../../controllers/workoutdata-controller');


// routes

router.get('/data', (req, res) => {
    let userID = req.session.passport.user
    console.log(userID)
    User.findOne({"_id": userID}, {hash: 0, salt: 0})
    .then((response) => {
        res.json({response})
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({response: "Failed"})
    })
})

router.get('/updatelocal', getWorkoutData, (req, res) => {
    user = req.user._doc
    user.salt = null
    user.hash = null 
    res.json({credentials: user, workoutData: req.workoutData })
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