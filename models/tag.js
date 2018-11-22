var mongoose = require('mongoose');

var Schema = mongoose.Schema;

//Tag model 
var TagSchema = new Schema(
  {
    tag: {type: String, required: true, min: 3, max: 100},
  }
);

//Virtual for tags URL if we're gonna use them.
GenreSchema
.virtual('url')
.get(function () {
  return '/catalog/tag/' + this._id;
});



//Export model
module.exports = mongoose.model('Tag', TagSchema);