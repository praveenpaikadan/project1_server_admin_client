const router   = require('express').Router();
const AdminUser = require('../../models/admin-user')

router.post('/', (req, res, next) => {
    console.log(req.body)
    let adminUser = new AdminUser({
        name: req.body.name,
        designation: req.body.designation,
        email: req.body.email,
        previlage: req.body.previlage,
        password: req.body.password,
    })

    adminUser.save()   
    .then(response => {
        res.json({
            status: 1,
            response 
        })
    })
    .catch(error => {
        res.json({
            status: 0,
        })
    })
})

module.exports = router