const router   = require('express').Router();

const adminUserRouter   = require('./admin-routes/admin-user')
const adminProgramRouter   = require('./admin-routes/admin-programs')
const adminExerciseRouter   = require('./admin-routes/admin-exercises')

// const adminClientRouter   = require('./admin-routes/admin-client)


router.use('/adminuser', adminUserRouter)
router.use('/programs', adminProgramRouter)
router.use('/exercises', adminExerciseRouter)

//router.use('/clients', adminClientRouter)

module.exports = router