const router   = require('express').Router();
const path = require('path')
const {Order} = require('../../controllers/payment-controllers')


router.get('/payment-page', async (req, res, next) => {
    var data = JSON.parse(req.headers['x-access-ver'])
    var userName = req.user._doc?req.user._doc.name:null
    var userEmail = req.user._doc?req.user._doc.email:null


    generateOrderParameters(data)
    var orderParameters = {}
    orderParameters.amount = data.amount
    orderParameters.receipt = data.receipt
    orderParameters.notes = data.notes

    var order = new Order(orderParameters)
    var order = await order.create()

    if(order){
        // options = JSON.stringify(options)

        res.render('user-views/payment-page', {
            amount: String(order.amount),
            name: "Aboo Thahir Fitness",
            description: "Test Transaction",
            order_id: order.id,
            userName: userName,
            userEmail: userEmail,
            color: "#FF4C00",
        })
    }else{
        res.send(`
        <!doctype html>
        <html>
          <head>
            <title>Something went wrong. Go back and try again</title>
          </head>
          <body>
            <h3>Something went wrong. Go back and try again</h3>    
          </body>
        </html>
      `
    )
    }
})



module.exports = router