var mongoose = require('mongoose');

var Schema = mongoose.Schema;

//Tag model 
var TagSchema = new Schema(
  {
    name: {type: String, required: true, min: 3, max: 100},
  }
);

//Virtual for tags URL if we're gonna use them.
TagSchema
.virtual('url')
.get(function () {
  return '/tags/tag/' + this._id;
});



//Export model
module.exports = mongoose.model('Tag', TagSchema);