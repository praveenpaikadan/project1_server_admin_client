const router   = require('express').Router();
const UserRouter   = require('./user-routes/user')
const passport = require('passport')
const User = require('../models/user')
const { genPassword } = require('../lib/passwordUtils')
const { isAuth } = require('./authmiddleware')


router.use((req, res, next) => {
    console.log(req.headers.cookie)
    next()
})


router.post('/checkemail', (req, res, next) => {

    if(!(req.body.email)){
        res.status(400).end()
        return
    }

    User.findOne({email: req.body.email})
    .then((result) => {
        if(result!=null){
            // if the query returned an item that is not null
            res.status(409).json({errorMessage: "Already registered. Try with a different email OR Sign In"})
            return
        }else{
            res.status(200).end()
            return
        }})
    .catch(err =>{
        res.status(500).json({errorMessage: "Data base error"})
    })
})

router.post('/signup', (req, res, next) => {
    console.log(req.body)

    if(!(req.body.email && req.body.password && req.body.name)){
        res.status(400).end()
        return
    }

    // checking if user already exist
    User.findOne({email: req.body.email})
    .then((result) => {
        if(result!=null){
            // if the query returned an item that is not null
            res.status(409).json({errorMessage: "Already registered. Try with a different email OR Sign In"})
            return
        
        }else{

            // if query returned null
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
                response.hash = null
                response.salt= null
                res.json(response)
            })
        
            .catch(error => {
                console.log(error)
                // 503 service unavailable
                res.status(503).json({
                    errorMessage:"Data base Error"
                })
            }) 
        }})

    .catch(error => {
        console.log(error)
        // 503 service unavilable 
        res.status(503).json({
            errorMessage:"Data base error"
        })
    })
})

//api/v1/login
router.post('/login', passport.authenticate('user'), (req, res) => {
    var user = req.user
    user.hash= null
    user.salt= null
    console.log(user)
    res.json(user)
})

router.get('/logout', (req,res,next) => {
    req.logOut()
    req.session.destroy((err)=> {
        if(!err){res.send('Logged out')}
    })
})

router.use(isAuth)

router.use('/user', UserRouter)
// router.use('/programs', adminProgramRouter)
// router.use('/exercises', adminExerciseRouter)

//router.use('/clients', adminClientRouter)

module.exports = router