const mongoose = require('mongoose')
require('dotenv').config();
const uri = process.env.DB_STRING;

// Main database
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

connection = mongoose.connection

connection.on('error', err => {
    console.log(err)
})

connection.once('open', () => {
    console.log('Date base connection established ...' )
})

module.exports = connection;
