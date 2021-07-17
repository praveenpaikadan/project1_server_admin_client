module.exports.isAuth = (req, res, next) => {
    console.log(req.session)
    if(req.isAuthenticated()) {
        next();
    } else {
        res.json({
            msg: 'Not autherised'
        })
    }
}

module.exports.isAdmin = (req,res,next) => {
    if(req.user.admin == true) {
        next();
    } else {
        res.json({
            msg: 'Not an admin'
        })
    }
}