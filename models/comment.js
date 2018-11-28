var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CommentSchema = new Schema(
  {
    user: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    time_posted: {type: Date, required: true},
    comment: {type: String, required: true, min: 1},    
  }
);

// Virtual for comment's URL - if we need to use it.
CommentSchema
.virtual('url')
.get(function () {
  return '/comics/comment/' + this._id;
});


//Export model
module.exports = mongoose.model('Comment', CommentSchema);