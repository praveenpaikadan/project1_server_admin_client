const mongoose = require('mongoose');

const adminUserSchema =  mongoose.Schema({
    name: String,
    designation: String,
    previlage: String,
    email: String,
    password: String,
}, { timestamps : true})

const AdminUser = mongoose.model('adminUser', adminUserSchema)

module.exports = AdminUser