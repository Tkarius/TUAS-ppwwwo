var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var Entities = require('html-entities').AllHtmlEntities;

const htmlEntities = new Entities();

var Schema = mongoose.Schema;

var UserSchema = new Schema(
  {
    username: {type: String, required: true, min:3, max: 50},
    password: {type: String, required: true,min:8, max: 50},
  }
);

// Virtual for author's URL - if we need to use it.
UserSchema
.virtual('url')
.get(function () {
  return '/users/' + this._id;
});

// Authentication handler
UserSchema
.statics
.authenticate = function(username, password, callback) {
  User.findOne({ username: username })
    .exec(function(err, user) {
      if (err) {
        return callback(err);
      }
      else if (!user) {
        var noSuchUserError = new Error("No such user.");
        err.status = 401;
        return callback(noSuchUserError);
      }

      bcrypt.compare(password, htmlEntities.decode(user.password), function(err, result) {
        if (result === true) {
          return callback(null, user);
        } 
        else {
          return callback();
        }
      });
    });
}

// This is done before creating new Users.
UserSchema
.pre('save', function(next) {
  var currentUser = this;
  console.log("Debug: Preprocessing pw hash.")
  // Hash the password with 10 rounds of salt before saving it to Db
  bcrypt.hash(currentUser.password, 10, function(error, hash) {
    if (error) {
      return next(err);
    }
    currentUser.password = hash;
    next();
  })
});


//Export model
module.exports = mongoose.model('User', UserSchema);