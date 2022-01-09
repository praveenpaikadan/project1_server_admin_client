const router   = require('express').Router();
const UserRouter   = require('./user-routes/user')
const passport = require('passport')
const User = require('../models/user')
const { genPassword } = require('../lib/passwordUtils')
const { isAuth } = require('./authmiddleware')
const WorkoutRouter = require('./user-routes/workout-data')
const SubscriptionRouter = require('./user-routes/subscription')
const GeneralRouter = require('./user-routes/general')
const DietPlanRouter = require('./user-routes/diet-plan')
const PaymentRouter = require('./user-routes/payment')
const express = require('express')
const {sendVerificationEmail, verifyEmail, removeVerificationCodes} = require('../controllers/email-verfication');
const { checkIfRequestByIDandAlterUrlIfNeeded } = require('../controllers/image-controllers');



const getMediaPath = (secured=false) => {
    let sep =  __dirname.includes('/')?'/':"\\"
    let url = __dirname.split(sep)
    url.pop()
    return ([...url, 'static', `${!secured?'media':'protected-media'}`].join(sep))
}


// router.use((req, res, next) => {
//     console.log(req.body)
//     next()
// })


// Emai lVerfication works like this - On signing upth euser enter the emil, password , name the on pressing sign up data gets posted to the below route. The server will send a verification code to the email, and stroe email, salt, hash of this code in the database.
// on the nest screen user enter this code, the code will be posted to check codee and the email is send to the /cjheckcode route -> the route eill identify the document item based on the email and compare the hash of the code received. 
// on matching, the route will return a second code to the client -> this code is hashed and saved in the same object as before. The client attach this code to the final user creation post to validate the entry
// The purpose of 2 codes is to prevent making of user document if the sign up procedure is not complete., and note to mess with other route which already exist.

router.post('/checkemail', (req, res, next) => {

    var shouldExist = req.body.shouldExist?true:false  //when shouldExist is in the body, it means the request is for a reset password. Other wise it is for first time registration 

    if(!(req.body.email)){
        res.status(400).end()
        return
    }

    User.findOne({email: req.body.email})
    .then((result) => {

        if(!shouldExist){
            if(result!=null){
                // if the query returned an item that is not null
                res.status(409).json({errorMessage: "Already registered. Try with a different email OR Sign In"})
                return
            }else{
                sendVerificationEmail(req.body)
                res.status(200).send('Email Verification code send')
                return
            }

        }else{
            if(result==null){
                // if the query returned an item that is not null
                res.status(200).json({success: false})
                return
            }else{
                sendVerificationEmail({email: req.body.email, user: result.name})
                res.status(200).json({name: result.name, success: true})
                return
            }
        }
    })
    .catch(err =>{
        res.status(500).json({errorMessage: "Data base error"})
    })
})

router.post('/verifyemail', (req, res, next) => {
    console.log(req.body)
    if(!req.body.email || !req.body.code){
        res.status(400).end()
        return
    }
    verifyEmail(req.body.email, req.body.code)
    .then((response) => {
        res.json({verified: response})  // 1 -> success, 0 => 'Expired', -1 => failes, 99 => Error
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
            // checking email verification is done.
            verifyEmail(req.body.email, req.body.code)
            .then((result) => {
                if(result == -1 || result == 0){
                    res.status(409).json({errorMessage: "Your email verification has expired/failed. Please Sign Up Again"})
                    return
                }else if(result == 99){
                    res.status(409).json({errorMessage: "Something happened. We are not able to register you. Please try again"})
                }else{
                    removeVerificationCodes(req.body.email)
                    let saltHash = genPassword(req.body.password)
                    let salt = saltHash.salt; 
                    let hash = saltHash.hash;
                    req.body.salt = salt
                    req.body.hash = hash
                    req.body.verified = true
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
                }
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

router.post('/resetpwd', (req, res, next) => {

    if(!(req.body.email && req.body.password && req.body.code)){
        res.status(400).end()
        return
    }

    verifyEmail(req.body.email, req.body.code)
        .then((result) => {
            if(result == -1 || result == 0){
                res.json({success: false, message: 'Email verification have expired/failed. Please try again', redirect: true})
                return
            }else if(result == 99){
                res.json({success: false, message: "Something happened. We are not able to change your password. Please try again"})
            }else{
                removeVerificationCodes(req.body.email)
                let saltHash = genPassword(req.body.password)
                var update = saltHash
                console.log(update)
                User.findOneAndUpdate({"email": req.body.email}, update, {new: true})  
                .then(response => {
                    res.json({success: true, message: 'Password changed successfully. Please Sign in with new password', redirect: true})
                })
                .catch(error => {
                    console.log(error)
                    // 503 service unavailable
                    res.status(503).json({
                        success:false,
                        message:"We were not able to change your password. Please try again "
                    })
                }) 
            }
        }) 


    .catch(error => {
        console.log(error)
        // 503 service unavilable 
        res.status(503).json({
            success:false,
            message:"Data base error"
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
    console.log('Reacched logout route')
    req.logOut()
    req.session.destroy((err)=> {
        if(!err){res.send('Logged out')}
    })
})

// router.use((req, res, next) => {console.log(req.originalUrl); next()})
router.use('/media', checkIfRequestByIDandAlterUrlIfNeeded, express.static(getMediaPath()));  // publically available media only
router.use('/protected-media', checkIfRequestByIDandAlterUrlIfNeeded, express.static(getMediaPath(secured=true)));  // protected media only

router.use(isAuth)
router.use('/user', UserRouter)
router.use('/workoutdata', WorkoutRouter)
router.use('/subscription', SubscriptionRouter)
router.use('/general', GeneralRouter)
router.use('/diet-plan', DietPlanRouter)
router.use('/payment', PaymentRouter)

module.exports = router