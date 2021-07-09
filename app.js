const express       = require('express');
const mangoose      = require('mongoose');
const morgan        = require('morgan');
const bodyParser    = require('body-parser');


const adminCentralRoute    = require('./routes/admin-central-router') 


mangoose.connect('mongodb://localhost:27017/attestdb', {useNewUrlParser: true, useUnifiedTopology : true})
const db = mangoose.connection

db.on('error', err => {
    console.log(err)
})

db.once('open', () => {
    console.log('Date base connection established ...' )
})

const app = express()
app.use(morgan('dev'))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server Running at ${PORT}`)
})


app.use('/api/admin', adminCentralRoute)


