var ipAddress = require('ip').address();
const PORT = process.env.PORT || 3000
const APP_API_BASE_URL = `https://${ipAddress}:${PORT}/api/v1` 
const ADMIN_API_BASE_URL = `https://${ipAddress}:${PORT}/api/admin`

module.exports = {ipAddress, PORT, APP_API_BASE_URL, ADMIN_API_BASE_URL}