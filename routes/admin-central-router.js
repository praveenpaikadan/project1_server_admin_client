const router   = require('express').Router();
const express  = require('express')
const passport = require('passport');
const fileupload = require('express-fileupload');

const adminUserRouter   = require('./admin-routes/admin-users')
const adminProgramRouter   = require('./admin-routes/admin-programs')
const adminExerciseRouter   = require('./admin-routes/admin-exercises');
const adminClientRouter   = require('./admin-routes/admin-clients');
const adminMediaRouter   = require('./admin-routes/admin-media');
const adminWorkoutRouter   = require('./admin-routes/admin-workouts');
const { isAuth, isAdmin  } = require('./authmiddleware');
const adminContactRouter = require('./admin-routes/admin-contact')
const adminDietPlanRouter = require('./admin-routes/admin-diet-plans');
const { ifMediaRouteHasUrlThenRedirect } = require('../controllers/cloudinary-controller');


// for using with cloudinary upload. This is to get the file as req.files  < === CLOUDINARY 
router.use(fileupload({useTempFiles: true}))



const getMediaPath = (type) => {
    let sep =  __dirname.includes('/')?'/':"\\"
    let url = __dirname.split(sep)
    url.pop()
    return ([...url, 'static', type?'media':'protected-media'].join(sep))
}

const getProfilePicturePath = () => {
    let sep =  __dirname.includes('/')?'/':"\\"
    let url = __dirname.split(sep)
    url.pop()
    return ([...url, 'static', 'profile-photos'].join(sep))
}

// const adminClientRouter   = require('./admin-routes/admin-client)


// debuging middleware . TO be removed in production
// router.use((req,res,next) => {
//     // res.setHeader('Access-Control-Allow-Headers', 'Set-Cookie')
//     console.log('user' in req)
//     console.log(req['user']['_doc']['name'])
//     console.log(req.baseUrl)
//     next()
// })

// public routes ----------------
router.get('/', (req, res, next) => {
    if(!isAuth){
        res.redirect('admin/login')
    }
})

router.get('/login', (req,res,next) => {
    res.render("admin-views/login")
})

// router.post('/login', passport.authenticate('admin', {failureRedirect:'/admin/login', successRedirect:'/admin/dashboard'}))
router.post('/login', passport.authenticate('admin'), (req, res) => {
    var user = req.user
    user.hash= null
    user.salt= null
    res.json({response: user})
})


// protected routes ----

// gate keeper - All request with an invalid cookie will be redirected to login at here.
router.use(isAuth, isAdmin);

router.get('/dashboard', (req, res, next) => {
    res.render('admin-views/dashboard')
})

router.get('/logout', (req,res,next) => {
    req.logOut()
    req.session.destroy((err)=> {
        if(!err){res.send('Logged out')}
    })
})


router.use('/media', 
    
    // to redirect to cloudinary url
    ifMediaRouteHasUrlThenRedirect,

    express.static(getMediaPath(false)), 
    express.static(getMediaPath(true)), 
    express.static(getProfilePicturePath())
    );

router.use('/adminusers', adminUserRouter)
router.use('/programs', adminProgramRouter)
router.use('/exercises', adminExerciseRouter)
router.use('/clients', adminClientRouter)
router.use('/workouts', adminWorkoutRouter)
router.use('/contact', adminContactRouter)
router.use('/diet-plan', adminDietPlanRouter)
router.use('/handle-media', adminMediaRouter)


//router.use('/clients', adminClientRouter)

module.exports = router