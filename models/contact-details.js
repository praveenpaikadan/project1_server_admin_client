const mongoose = require('mongoose');

const contactSchema =  mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    whatsapp: String,
    website: String,
    info: String,
    infolink: String,
    lat: Number,
    long: Number,
    detailedWriteup: String,
    address: String,
    photo: {filename: String, path: String}
}, { timestamps : true})

const Contact = mongoose.model('contact', contactSchema)

module.exports = Contact