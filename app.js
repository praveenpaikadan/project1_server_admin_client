const express       = require('express');
const morgan        = require('morgan');
const passport      = require('passport')
const session       = require('express-session');
const MongoStore    = require('connect-mongo')(session);
const bodyParser    = require('body-parser')
const {tokenInterceptor} = require('./lib/tokenUtils')
const path = require('path');
const fileupload = require('express-fileupload');



var cors = require('cors');

// database 
const connection            = require('./config/database');

// Importing Primary routes
const adminCentralRoute     = require('./routes/admin-central-router')
const userCentralRoute      = require('./routes/user-central-router')

// importing variables
require('dotenv').config();

// make a request to server api every 25 mins to prevent dyno from sleeping. // free heroku subscription has a limit to keep server alive each month. SO this was turned off.
// require('./lib/keep-server-alive')  

// Authentication confiurations
require('./config/passport');

// Starting app
const app = express()

// Basic function middlewares

app.use(cors({
    credentials: true, 
    origin: 'http://localhost:3000', // web front end server address
    //Origin: '*' // this will cause an error
}))


// to add cookies from x-access-token header in requests from mobile clients
// app.use(tokenInterceptor)

app.use(morgan('dev'))

// for using with cloudinary upload. This is to get the file as req.files  < === CLOUDINARY REQUIREMENT
app.use(fileupload({useTempFiles: true}))


// app.use(express.json());  // comment this out if any anomaly
// app.use(bodyParser.json());
// app.use(express.urlencoded({ extended: true }));

app.use(express.json({limit: '5mb'}));  // comment this out if any anomaly
app.use(bodyParser.json({limit: '5mb'}));
app.use(express.urlencoded({ limit: '5mb', extended: true }));

// templating
app.set('views', './views')
app.set('view engine', 'ejs')

// app.use((req, res, next) => {
//     console.log(req.headers)
//     next()
// })

app.use(tokenInterceptor)
// keep the order : express-session => passport.initialize => passsport.session

// making session store in the database using existing connection
const sessionStore = new MongoStore({ mongooseConnection: connection, collection: 'sessions'})
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
        // maxAge: 1000*60*60*24*365
    }
}));

// Initializing authentication and sessions.
app.use(passport.initialize());
app.use(passport.session());



// routes
app.use('/api/admin', adminCentralRoute)
app.use('/api/v1/', userCentralRoute)

// to prevent heroku server from sleeping. see lib/keep-server-alive.js file
app.use('/api/keepalive', (req, res) => {res.status(200).send(); return})


// serve react js static files for admin dash
app.use(express.static(path.join(__dirname, 'client/build')));

app.use('/admin', (req, res) => {
    if(req.method === 'GET'){
        res.sendFile(path.join(__dirname+'/client/build/index.html'));
    }else{
        res.status(400).send('Bad Request')
    }
});

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server Running at ${PORT}`)
})



