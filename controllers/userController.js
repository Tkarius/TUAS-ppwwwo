
exports.user_list = (req, res, next) => {
    res.send('respond with a resource');
};

exports.user_details = (req, res, next) => {
    //get user details from user model. Render page. :P
    res.send('NOT IMPLEMENTED: User details')
}

exports.user_create_get = (req, res, next) => {
    //Render registration page.
    //Check if user is already logged in. If user already logged in, show error?
    res.send('NOT IMPLEMENTED: user_create_get')
}

exports.user_create_post = (req, res, next) => {
    //validate registration form. If valid create new user. If not valid, render registration page with error info
    res.send('NOT IMPLEMENTED: user_create_post')
}
