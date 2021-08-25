const passport      = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const AdminUser     = require('../models/admin-user')
const User          = require('../models/user')
const validPassword = require('../lib/passwordUtils').validPassword

const customFields = {
    usernameField: 'email',
    passwordField: 'password'
}

const userVerifyCallback = (email, password, done) => {
    User.findOne({ email: email})
    .then(user => {
        if(!user){
            return done(null, false)
        }else{
            const isValid = validPassword(password, user.hash, user.salt);
            if(isValid){
                return done(null, user);
            }else{
                return done(null, false)
            }
        }
    })
    .catch(err =>{
        done(err);
        }
    )
}

const adminVerifyCallback = (email, password, done) => {
    AdminUser.findOne({ email: email})
    .then(user => {
        if(!user){
            return done(null, false)
        }else{
            const isValid = validPassword(password, user.hash, user.salt);
            if(isValid){
                return done(null, user);
            }else{
                return done(null, false)
            }
        }
    })
    .catch(err =>{
        done(err);
        }
    )
}

const userStrategy = new LocalStrategy(customFields, userVerifyCallback)
const adminStrategy = new LocalStrategy(customFields, adminVerifyCallback)

passport.use('user', userStrategy);
passport.use('admin', adminStrategy);


passport.serializeUser((user, done) => {
    done(null, user.id)
})


passport.deserializeUser((userId, done) => {
    User.findById(userId)
    .then(user => {
        if(user === null) {
            AdminUser.findById(userId)
            .then(user => {
                console.log(user)
                done(null,{admin: true, ...user})
            })
            .catch(err => {
                done(err)
            })        

            return 
        }
        done(null,user)
    })
    .catch(err => done(err) )
})