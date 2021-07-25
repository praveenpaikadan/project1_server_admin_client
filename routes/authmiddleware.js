module.exports.isAuth = (req, res, next) => {
    if(req.isAuthenticated()) {
        next();
    } else {
        console.log('Not Authenticated')
        res.status(403)
        res.redirect('/admin/login')
    }
};

module.exports.isAdmin = (req, res, next) => {
    if(req.user.admin == true) {
        next();
    } else {
        res.status(403).end();
    }
};