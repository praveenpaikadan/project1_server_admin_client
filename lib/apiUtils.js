
// On production
// var ipAddress = require('ip').address();
// const PORT = process.env.PORT || 3000
// const APP_API_BASE_URL = `https://${ipAddress}:${PORT}/api/v1` 
// const ADMIN_API_BASE_URL = `https://${ipAddress}:${PORT}/api/admin`
// const API_BASE_URL = `https://${ipAddress}:${PORT}/api`

// On development
// var ipAddress = require('ip').address();
// const PORT = process.env.PORT || 3000
// const APP_API_BASE_URL = `http://${ipAddress}:${PORT}/api/v1` 
// const ADMIN_API_BASE_URL = `http://${ipAddress}:${PORT}/api/admin`
// const API_BASE_URL = `http://${ipAddress}:${PORT}/api`

// alternate
var ipAddress = require('ip').address();
const PORT = process.env.PORT || 3000
const APP_API_BASE_URL = process.env.BASE_URL || 'https://personal-training-app.herokuapp.com' + `/api/v1` 
const ADMIN_API_BASE_URL = process.env.BASE_URL || 'https://personal-training-app.herokuapp.com' +  `/api/admin`
const API_BASE_URL = process.env.BASE_URL || 'https://personal-training-app.herokuapp.com' + `/api`


module.exports = {ipAddress, PORT, APP_API_BASE_URL, ADMIN_API_BASE_URL, API_BASE_URL}