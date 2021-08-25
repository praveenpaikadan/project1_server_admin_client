module.exports.tokenInterceptor = (req, res, next) => {
    const value = req.headers['x-access-token']
    if(!value){
        console.log('tokenless request')
        return next()
    }
    req.headers.cookie = `connect.sid=s%3A${value};`
    next()
}