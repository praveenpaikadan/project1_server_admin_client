const { API_BASE_URL } = require("./apiUtils")
const fetch = require('node-fetch');

var SEND_REQUEST_EVERY = 25*60*1000 // 25 mins 

console.log('Keep server alive')
setInterval(() => {
    fetch(API_BASE_URL+'/keepalive')
    .then(() => {console.log('Sent Keep alive request')})
    .catch((err) => {console.log('Error received for keep alive request', err)})

}, SEND_REQUEST_EVERY)