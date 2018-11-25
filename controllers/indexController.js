
exports.viewIndex = (req, res, next) => {
    //user defined here for layout testing purposes
    //in reality this is the user model of the current user
    let user = {
        username:'Esteri'
    }
    res.render('index', {pageTitle:'Home', pageDescription:'Welcome to Comic Reviewer!', user:user, title:'Comic Reviewer'});
}