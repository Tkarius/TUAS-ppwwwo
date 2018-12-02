
var User = require('../models/user.js')

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
    res.render('user_register', {pageTitle:'Register', pageDescription:'Register new user account'})
}

exports.user_create_post = (req, res, next) => {
    //validate registration form. If valid create new user. If not valid, render registration page with error info

    if (req.body.password && req.body.confirmPass && req.body.username) {
        var newUser = {
            username: req.body.username,
            password: req.body.password,
        }

        User.create(newUser, function(error, user) {
            console.log("DEBUG: In new user creation.")
            if (error) {
                return next(error);
            }
            else {
                // Use the MongoDb index as unique userID
                req.session.userId = user._id;
                return res.redirect('/');
            }
        });
    }
    else {
        console.log("DEBUG: something was missing in user registration!")
        var missingInputError = new Error("Required field is empty.");
        missingInputError.status = 400;
        return next(missingInputError);
    }
    //res.send('NOT IMPLEMENTED: user_create_post')
}

exports.user_login_get = (req, res, next) => {
    res.render('user_login', {pageTitle:'Login', pageDescription:'Login with an existing user account'})
}

exports.user_login_post = (req, res, next) => {
    //validate, do login stuff
    res.send('NOT IMPLEMENTED: user_login_post')
}
