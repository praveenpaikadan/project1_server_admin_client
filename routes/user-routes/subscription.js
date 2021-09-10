
const { makeNewWorkoutData, getAvailablePrograms }  = require('../../controllers/subscription-controller'  );
const router   = require('express').Router();

router.get('/availableprograms', getAvailablePrograms)

router.post('/new', makeNewWorkoutData)



module.exports = router