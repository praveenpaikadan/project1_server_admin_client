const router   = require('express').Router();
const Contact  = require('../../models/contact-details');



router.get('/contact', (req,res) => {
    Contact.find().select({updatedAt: 0, createdAt: 0}).sort('updatedAt')
    .then(response => {
        res.json(
            response[0]
        )
    })
    .catch(error => {
        console.log(err)
        res.json({
            error: 'An error Ocuured while fetching contact datails'
        })
    })
})

module.exports = router