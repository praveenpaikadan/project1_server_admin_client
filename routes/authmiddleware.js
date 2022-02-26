module.exports.isAuth = (req, res, next) => {
    // console.log(req.headers)
    if(req.isAuthenticated()) {
        next();
    } else {
        // console.log('Not Authenticated')
        res.status(403).end()
    }
};

module.exports.isAdmin = (req, res, next) => {
    if(req.user.admin == true) {
        next();
    } else {
        res.status(403).end();
    }
};

