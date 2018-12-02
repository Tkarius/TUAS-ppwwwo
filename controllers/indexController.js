
exports.viewIndex = (req, res, next) => {
    //user defined here for layout testing purposes
    //in reality this is the user model of the current use
    res.render('index', {pageTitle:'Home', pageDescription:'Welcome to Comic Reviewer!', title:'Comic Reviewer', user: req.user});
}