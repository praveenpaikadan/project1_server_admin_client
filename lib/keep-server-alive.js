const { API_BASE_URL } = require("./apiUtils")
const fetch = require('node-fetch');

// var SEND_REQUEST_EVERY = 10*60*1000 // 25 mins 

SEND_REQUEST_EVERY = process.env.KEEP_SERVER_ALIVE_AT_MINS*1000 || 10*60*1000

console.log('Keep server alive')
setInterval(() => {
    fetch(API_BASE_URL+'/keepalive')
    .then(() => {})
    .catch((err) => {console.log('Error received for keep alive request', err)})

}, SEND_REQUEST_EVERY)