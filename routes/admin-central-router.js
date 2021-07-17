const router   = require('express').Router();
const passport = require('passport');
const adminUserRouter   = require('./admin-routes/admin-users')
const adminProgramRouter   = require('./admin-routes/admin-programs')
const adminExerciseRouter   = require('./admin-routes/admin-exercises');
const { isAuth } = require('./authmiddleware');

// const adminClientRouter   = require('./admin-routes/admin-client)

// Authentication confiurations

router.post('/login', passport.authenticate('admin'), (req,res,next) => {
    if(req.user){
        res.send('login success')
    }else{
        res.send('login failed')
    }
})

router.get('/logout', (req,res,next) => {
    req.logOut()
    req.session.destroy((err)=> {
        if(!err){res.send('Logged out')}
    })
})

router.use(isAuth);

router.use('/adminusers', adminUserRouter)
router.use('/programs', adminProgramRouter)
router.use('/exercises', adminExerciseRouter)

//router.use('/clients', adminClientRouter)

module.exports = router