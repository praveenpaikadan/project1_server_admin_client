const nodemailer = require("nodemailer");
const {genCode, genPassword, validPassword} = require('../lib/passwordUtils')
const EmailCode = require('../models/email-code');

const routineCodeCleanup = () => {
  console.log('Routine verification code cleanup is running, to clean up email codes expired 24 hours before every 24 hours') // cleanup all expired codes expired 24 hours before every 24 hours

  setInterval(() => {
    EmailCode.deleteMany({ expiry: {$lt: Date.now()-(24*60*60*1000)}})
    .then((results) => {
      console.log('Email Code clean up done')
    })
    .catch((err) => {
      console.log('Email Code clean up failed: ', err)
    })
  }, 24*60*60*1000) 
}

async function removeVerificationCodes(email){
  EmailCode.deleteMany({ email: email})
  .then(()=> {})
  .catch((error) => console.log(error))
}

// async..await is not allowed in global scope, must use a wrapper
async function sendVerificationEmail(reqBody) {

  let {user, email} = reqBody

 let expiry = 10 * 60000 //10 mins
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  
  // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    host: process.env.SEND_VER_FROM_EMAIL_HOST,
    port: process.env.SEND_VER_FROM_EMAIL_PORT,
    auth: {
        user: process.env.SEND_VER_FROM_EMAIL_ID,
        pass: process.env.SEND_VER_FROM_EMAIL_PASS,
    }
});

  let code = genCode(6) // grnerate random code of 8 numbers . Return value is string
  let {salt, hash} = genPassword(code)

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: process.env.SEND_VER_FROM_EMAIL_FROM, // sender address
    to: email, // list of receivers
    subject: "Verification Code", // Subject line
    text: `Your Verification Code is ${code}. This code will expire in ${expiry/60000} minutes` , // plain text body
    html: `<b>Hi ${user?user:'user'} Your Verification Code is ${code}. This code will expire in ${expiry/60000} minutes</b>`, // html body
  });

  var emailCode = new EmailCode({email: email, salt: salt, hash: hash, expiry: (Date.now() + expiry)})
  emailCode.save()
  .then((DBresponse) => {
    // console.log(DBresponse)
  })
  .catch(() => {
      
  })

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}


async function verifyEmail(email,code){
  let condition = {email: email}
  try{
    let response = await (await EmailCode.find(condition))

    if (response === []){
      return -1
    }

    for (let i = 0; i< response.length; i++){
      if(validPassword(code, response[i].hash, response[i].salt)){
      
        if(Date.now() > response[i].expiry){
          // console.log(Date.now() +'>'+ response[i].expiry)
          return 0  // code expired 

        }else{  
          response[i].updateOne({expiry: Date.now() + (30*60000)})  // extending expiry by 30 mins.
          .then(() => {
            // console.log('Success')
            EmailCode.deleteMany({ expiry: {$lt: Date.now()}}) // deleting all expired codes -> A clean up process
          })    
          return 1  // code valid
        }
      }
    } 

    return -1 // invalid code
  }catch{
    return 99 // error
  }
} 

routineCodeCleanup()

module.exports = {sendVerificationEmail, verifyEmail, removeVerificationCodes}