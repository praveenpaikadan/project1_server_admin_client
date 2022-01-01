const querystring = require('querystring');

module.exports.tokenInterceptor = (req, res, next) => {
    let value = req.headers['x-access-token']
    
    // Extracting sid from querry
    if(!value){
        value = req.query['sid']
    }
    //extraction over

    if(!value){
        console.log('tokenless request')
        return next()
    }
    req.headers.cookie = `connect.sid=s%3A${value}`
    next()
}

module.exports.tokenExtractor = (req) => {
    try{
        var value = req.headers.cookie
        return value.slice(16)
    }catch(error){
        console.log(error)
        return null 
    }
}