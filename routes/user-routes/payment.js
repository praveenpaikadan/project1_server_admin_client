const router   = require('express').Router();
const path = require('path')
const {Order, returnReceiptIfExist, successPaymentHandler, failedPaymentHandler} = require('../../controllers/payment-controllers');
const { tokenExtractor } = require('../../lib/tokenUtils');
var ipAddress = require('ip').address();
var PORT = require('dotenv').config().parsed.PORT;


router.get('/payment-page', async (req, res, next) => {

    var data = JSON.parse(req.headers['x-access-ver'])
    data.userName = req.user._doc?req.user._doc.name:null
    data.userEmail = req.user._doc?req.user._doc.email:null
    data.userID = req.user._doc?req.user._doc._id:null

    var authToken = req.headers['x-access-token']?req.headers['x-access-token']:tokenExtractor(req)

    if(!data.type){
      res.status(400).send('Bad Request')
    }
    
    var order = new Order(data) 
    var existingReceipt = await returnReceiptIfExist(data) 
    var receipt = await order.createReceipt(existingReceipt)
    var orderDetails = await order.retreiveOrderDetails()
    if(!orderDetails){
      orderDetails = await order.createOrder()
    }

    console.log(orderDetails)
    

    if(orderDetails){
        res.render('user-views/payment-page', {
            imgUrl: `http://${ipAddress}:${PORT}/api/v1/media/${order.getImageFile()}`,
            receiptID: receipt._id,
            batch: orderDetails.notes.batch,
            amount: orderDetails.amount,
            authToken: authToken,
            name: "Aboo Thahir Fitness",
            description: "Test Transaction",
            // productDescription: order.programData.productDescription,
            productDescription: "<b>Occaecat</b> <br/> magna exercitation aute pariatur elit ullamco occaecat officia irure esse laboris. Ea cillum fugiat sint id magna. Ut consequat mollit Lorem sunt elit. Ut cupidatat culpa mollit sit voluptate quis est ipsum consequat fugiat eiusmod tempor in occaecat. Reprehenderit consequat sint et reprehenderit dolore quis ut ea.Occaecat magna exercitation aute pariatur elit ullamco occaecat officia irure esse laboris. Ea cillum fugiat sint id magna. Ut consequat mollit Lorem sunt elit. Ut cupidatat culpa mollit sit voluptate quis est ipsum consequat fugiat eiusmod tempor in occaecat. Reprehenderit consequat sint et reprehenderit dolore quis ut ea.Occaecat magna exercitation aute pariatur elit ullamco occaecat officia irure esse laboris. Ea cillum fugiat sint id magna. Ut consequat mollit Lorem sunt elit. Ut cupidatat culpa mollit sit voluptate quis est ipsum consequat fugiat eiusmod tempor in occaecat. Reprehenderit consequat sint et reprehenderit dolore quis ut ea.Occaecat magna exercitation aute pariatur elit ullamco occaecat officia irure esse laboris. Ea cillum fugiat sint id magna. Ut consequat mollit Lorem sunt elit. Ut cupidatat culpa mollit sit voluptate quis est ipsum consequat fugiat eiusmod tempor in occaecat. Reprehenderit consequat sint et reprehenderit dolore quis ut ea.",
            notes: orderDetails.notes,
            order_id: orderDetails.id,
            batch: orderDetails.notes.batch,
            userName: orderDetails.notes.paidByUser,
            userEmail: orderDetails.notes.paidByEmail,
            duration: order.programData.durationWeeks,
            level: order.programData.level,
            goal: order.programData.goal,
            color: "#FF4C00",
            successHandlerUrl: `http://${ipAddress}:${PORT}/api/v1/payment/verify`
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

router.post('/verify', async (req, res, next) => {
    var data = req.body
    var response = await successPaymentHandler(data)
    if(response.verificationStatus){
      console.log(response)
      res.json(response)
    }
    return
})

// router.post('/recordfailure', async (req, res, next) => {
//   var data = req.body
//   var response = await failedPaymentHandler(data)
//   if(response){
//     console.log(response)
//     res.json({verificationStatus: 'success', message: response})
//   }else{
//     res.json({verificationStatus:'failed', message: 'Your payment verification has failed. Please redo the payment. Incase amount is deducted from the account, please contact us from trainer contact page.'})
//   }
// })



module.exports = router