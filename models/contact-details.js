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
    photo: {
        /* Changes to fit cloudinary: The 'filename' was actually supposed to save the file name.
        As cloudinary took over it would change now store the secure url. This is to not make any changes to the client side. The route handling 
        the image request formatted to accomodate the change.
        */
        filename: String, 
        path: String, 

        // added when cloudinary is added
        secureUrl: String, // Both filename and secureUrl will carry same values for now.
        meta: {
            public_id: String,
            secure_url: String
        }
    }
}, { timestamps : true})

const Contact = mongoose.model('contact', contactSchema)

module.exports = Contact