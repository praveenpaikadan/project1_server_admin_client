const router   = require('express').Router();
const DietPlan = require('../../models/diet-plan')


router.get('/:pID', (req,res) => {
    var userID = req.user._doc?req.user._doc._id:"111111111111111111111111"
    var programID = req.params.pID
    // console.log(userID)
    var condition = {'client.userID': userID, 'client.programID': programID}
    DietPlan.findOne(condition)
    .then(response => {
        res.json(response)
    })
    .catch(error => {
        // console.log(err)
        res.status(500).json({
            message: 'An error Ocuured while fetching excercise details'
        })
    })
})


module.exports = router


