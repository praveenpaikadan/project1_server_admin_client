const router   = require('express').Router();
const UserRouter   = require('./user-routes/users')
const passport = require('passport')
const User = require('../models/user')
const { genPassword } = require('../lib/passwordUtils')


router.post('/signup', (req, res, next) => {
    console.log(req.body)
    
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

//api/v1/login
router.post('/login', passport.authenticate('user'), (req, res) => {
    var user = req.user
    user.hash= null
    user.salt= null
    res.json({response: user})
})

router.get('/logout', (req,res,next) => {
    req.logOut()
    req.session.destroy((err)=> {
        if(!err){res.send('Logged out')}
    })
})


router.use('/users', UserRouter)
// router.use('/programs', adminProgramRouter)
// router.use('/exercises', adminExerciseRouter)

//router.use('/clients', adminClientRouter)

module.exports = router