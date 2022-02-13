const router   = require('express').Router();
const path = require('path')
const {Order, returnReceiptIfExist, successPaymentHandler, failedPaymentHandler} = require('../../controllers/payment-controllers');
const { handleSuccesfulSubscription } = require('../../controllers/workoutdata-controller');
const { getFullMediaUrlIfRelative } = require('../../lib/helpers');
const { tokenExtractor } = require('../../lib/tokenUtils');

// var ipAddress = require('ip').address();
// var PORT = require('dotenv').config().parsed.PORT;

// const BASE_URL = `http://${ipAddress}:${PORT}/api/v1`

const {APP_API_BASE_URL} = require('../../lib/apiUtils')


router.get('/payment-page', async (req, res, next) => {

    var data = JSON.parse(req.headers['x-access-ver'])
    data.userName = req.user._doc?req.user._doc.name:null
    data.userEmail = req.user._doc?req.user._doc.email:null
    data.userID = req.user._doc?req.user._doc._id:null

    var authToken = req.headers['x-access-token']?req.headers['x-access-token']:tokenExtractor(req)

    console.log(data)
    if(!data.type){
      res.status(400).send('Bad Request')
    }
    
    var order = new Order(data) // Create user defined class order instance
    var existingReceipt = await returnReceiptIfExist(data) 
    var receipt = await order.create_redate_validate_Receipt(existingReceipt)
    var orderDetails = await order.retreiveOrderDetails()
    
    if(!orderDetails){
      orderDetails = await order.createOrder()
    }

    // console.log(orderDetails)
    

    if(orderDetails){
        res.render('user-views/payment-page', {
            // imgUrl: `http://${ipAddress}:${PORT}/api/v1/media/${order.getImageFile()}`,
            imgUrl:  getFullMediaUrlIfRelative(order.programData.coverImage),
            receiptID: receipt._id,
            batch: orderDetails.notes.batch,
            amount: orderDetails.amount,
            authToken: authToken,
            name: "Aboo Thahir Fitness",
            description: "Test Transaction",
            // productDescription: order.programData.productDescription,
            productDescription: order.programData.otherRemarks || order.programData.goal,
            notes: orderDetails.notes,
            order_id: orderDetails.id,
            batch: orderDetails.notes.batch,
            userName: orderDetails.notes.paidByUser,
            userEmail: orderDetails.notes.paidByEmail,
            duration: order.programData.durationWeeks,
            level: order.programData.level,
            goal: order.programData.category,
            // color: "#FF4C00",
            color: "#5bb543",
            successHandlerUrl: APP_API_BASE_URL + `/payment/verify`,
            failedHandlerUrl: APP_API_BASE_URL + `/payment/recordfailure`
        })


    }else{
        res.send(`
        <!doctype html>
        <html>
          <head>
            <title>Something went wrong. Go back and try again</title>
          </head>
          <body>
            <h3 style="margin-top: 100px;">Something went wrong. Go back and try again</h3>    
          </body>
        </html>
      `
    )
    }
})

router.post('/verify', async (req, res, next) => {
    var data = req.body
    console.log(data)
    data.userID = req.user._doc._id
    var response = await successPaymentHandler(data)
    if(response.verificationStatus === 'success'){
      try{
        await handleSuccesfulSubscription(response.receipt, response.batchProcessed)
      }catch(error){
        console.log(error)
      }
     
    }
    if(response.verificationStatus){
      res.json(response)
    }
    return
})

router.post('/recordfailure', async (req, res, next) => {
  var data = req.body
  await failedPaymentHandler(data)
  res.end()
  return
})

module.exports = router