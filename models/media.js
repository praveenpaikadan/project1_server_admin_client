const mongoose = require('mongoose');

const mediaSchema = mongoose.Schema({
	relativeUrl: String,        // either url or filename
    initiallyFor: String,
    identifierText: String,
    secureUrl: String,
    meta: {}

}, { timestamps : true })

const Media = mongoose.model('Media', mediaSchema)
module.exports = Media
