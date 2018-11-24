
exports.viewIndex = (req, res, next) => {
    //user defined here for layout testing purposes
    //in reality this is the user model of the current user
    let user = {
        username:'blep'
    }
    res.render('index', { title: 'Comic Reviewer', pageTitle:'Home', pageDescription:'Welcome to Comic Reviewer!', user:user});
}