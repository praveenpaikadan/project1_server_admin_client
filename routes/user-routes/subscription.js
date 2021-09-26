
const {  getAvailablePrograms }  = require('../../controllers/subscription-controller'  );
const { makeNewWorkoutData, getWorkoutData } = require('../../controllers/workoutdata-controller');
const router   = require('express').Router();

router.get('/availableprograms', getAvailablePrograms)

router.post('/new', makeNewWorkoutData, getWorkoutData, (req, res) => {
    res.json(req.workoutData)
})



module.exports = router