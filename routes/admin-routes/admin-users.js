const router   = require('express').Router();
const AdminUser = require('../../models/admin-user')
const { isAuth } = require('../authmiddleware'); 
const { genPassword } = require('../../lib/passwordUtils')
const passport = require('passport')


// routes


router.post('/add', (req, res, next) => {

    let saltHash = genPassword(req.body.password)
    let salt = saltHash.salt; 
    let hash = saltHash.hash;

    let newAdmin = new AdminUser({
        name: req.body.name,
        designation: req.body.designation,
        previlage: req.body.previlage,
        email: req.body.email,
        hash: hash,
        salt: salt,
    })

    console.log(newAdmin)
    
    newAdmin.save()   
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

router.get('/', (req,res, next) => {
    AdminUser.find()
    .then(response => {
        res.json({
            response
        })
    })
    .catch(error => {
        console.log(err)
        res.json({
            message: 'An error Ocuured while fetching excercise details'
        })
    })
})

router.patch('/',(req,res) => {
    let conditions = { _id: req.body.id };
    
    AdminUser.findByIdAndUpdate(conditions, req.body.data, { new: true})
    .then((response) => {
        res.json({
            response
        })
    })
    .catch(error => {
        console.log(err)
        res.json({
            response: "Failed to update"
        })
    })
})

router.delete('/', (req, res)=>{
    let conditions = { _id: req.body.id};
    AdminUser.findByIdAndDelete(conditions)
    .then((response) => {
        res.json({
            response
        })
    })
    .catch(error => {
        console.log(err)
        res.json({
            response: "Failed to update"
        })
    })
})

module.exports = router