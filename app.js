const express       = require('express');
const morgan        = require('morgan');
const passport      = require('passport')
const session       = require('express-session');
const MongoStore    = require('connect-mongo')(session);

// database 
const connection            = require('./config/database');

// Importing Primary routes
const adminCentralRoute     = require('./routes/admin-central-router')
const userCentralRoute      = require('./routes/user-central-router')

// importing variables
require('dotenv').config();

// Authentication confiurations
require('./config/passport');

// Starting app
const app = express()

// Basic function middlewares
app.use(morgan('dev'))
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// templating
app.set('views', './views')
app.set('view engine', 'ejs')
// keep the order : express-session => passport.initialize => passsport.session

// making session store in the database using existing connection
const sessionStore = new MongoStore({ mongooseConnection: connection, collection: 'sessions'})
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
        maxAge: 1000*60*60*24*365
    }
}));



// Initializing authentication and sessions.
app.use(passport.initialize());
app.use(passport.session());

// routes
app.use('/admin', adminCentralRoute)
app.use('/api/v1/', userCentralRoute)


const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server Running at ${PORT}`)
})



