var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserSchema = new Schema(
  {
    username: {type: String, required: true, min:3, max: 50},
    password: {type: String, required: true,min:8, max: 50},    
  }
);



// Virtual for author's URL - if we need to use it.
AuthorSchema
.virtual('url')
.get(function () {
  return '/catalog/user/' + this._id;
});


//Export model
module.exports = mongoose.model('User', UserSchema);