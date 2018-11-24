var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var AuthorSchema = new Schema(
  {
    first_name: {type: String, required: false, max: 100},
    last_name: {type: String, required: true, max: 100},    
  }
);

// Virtual for author's full name - if we want to use it.
AuthorSchema
.virtual('name')
.get(function () {
  return this.last_name + ', ' + this.first_name;
});

// Virtual for author's URL - if we need to use it.
AuthorSchema
.virtual('url')
.get(function () {
  return '/comics/authors/author' + this._id;
});


//Export model
module.exports = mongoose.model('Author', AuthorSchema);