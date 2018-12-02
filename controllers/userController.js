
var User = require('../models/user.js')

exports.user_list = (req, res, next) => {
    res.send('respond with a resource');
};

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
            if (error) {
                return next(error);
            }
            else {
                // Use the MongoDb index as unique userID
                req.session.userId = user._id;
                req.session.userName = user.username;
                console.log("Debug: " + req.session.userName);
                let userObject = {
                    username: req.session.userName,
                    userId: req.session.userId
                }
                req.user = userObject;
                return res.redirect('/');
            }
        });
    }
    else {
        var missingInputError = new Error("Required field is empty.");
        missingInputError.status = 400;
        return next(missingInputError);
    }
}

exports.user_login_get = (req, res, next) => {
    res.render('user_login', {pageTitle:'Login', pageDescription:'Login with an existing user account'})
}

exports.user_login_post = (req, res, next) => {
    //validate, do login stuff

    if (req.body.username && req.body.password) {
        User.authenticate(req.body.username, req.body.password, function(error, user) {
            if (error || !user) {
                var loginError = new Error("Invalid username or password.");
                loginError.status = 401;
                return next(loginError);
            }
            else {
                req.session.userId = user._id;
                req.session.userName = req.body.username;
                return res.redirect('/');
            }
        });
    }
    else {
        var loginError = new Error("Username and password are required.");
        loginError.status = 401;
        return next(loginError);
    }

}

exports.user_logout_get = (req, res, next) => {
    // This should never be called if there's no session
    if (req.session) {
        req.session.destroy(function(err) {
            if (err) {
                next(err);
            }
            else {
                return res.redirect("/");
            }
        });
    }
}
