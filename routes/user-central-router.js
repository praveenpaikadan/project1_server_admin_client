const router   = require('express').Router();

const UserRouter   = require('./user-routes/users')
// const adminProgramRouter   = require('./admin-routes/admin-programs')
// const adminExerciseRouter   = require('./admin-routes/admin-exercises')

// const adminClientRouter   = require('./admin-routes/admin-client)


router.use('/users', UserRouter)
// router.use('/programs', adminProgramRouter)
// router.use('/exercises', adminExerciseRouter)

//router.use('/clients', adminClientRouter)

module.exports = router