const nodemailer = require("nodemailer");
const {genCode, genPassword, validPassword} = require('../lib/passwordUtils')
const EmailCode = require('../models/email-code');

// async..await is not allowed in global scope, must use a wrapper
async function sendVerificationEmail(reqBody) {

  let {user, email} = reqBody

 let expiry = 10 * 1000 //10 mins
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  
  // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'adalberto.okuneva52@ethereal.email',
        pass: 'JbYCgQ2F2PpZj91Mux'
    }
});

  let code = genCode(6) // grnerate random code of 8 numbers . Return value is string
  let {salt, hash} = genPassword(code)

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Fred Foo 👻" <foo@example.com>', // sender address
    to: email, // list of receivers
    subject: "Verification Code", // Subject line
    text: "Your Verification Code is "+ code, // plain text body
    html: `<b>Hi ${user?user:'user'} Your Verification Code is ${code}</b>`, // html body
  });

  var emailCode = new EmailCode({email: email, salt: salt, hash: hash, expiry: Date.now() + expiry})
  emailCode.save({email: email, salt: salt, hash: hash, expiry: Date.now() + expiry})
  .then((DBresponse) => {
    console.log(DBResponse)
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
    for (let i = 0; i< response.length; i++){
      if(validPassword(code, response[i].hash, response[i].salt)){
        console.log(code)
        if(Date.now() > response[i].expiry){
          EmailCode.deleteMany({ expiry: {$lt: Date.now()}})  // deleting all expired codes.
          return 0  // code expired 
        }else{  
          response[i].updateOne({expiry: Date.now() + (30*1000)})  // extending expiry by 30 mins.
          .then(() => {
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

module.exports = {sendVerificationEmail, verifyEmail}