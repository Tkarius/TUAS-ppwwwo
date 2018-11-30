var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CommentSchema = new Schema(
  {
    user: {type: String, required: true},
    time_posted: {type: Date, required: true},
    content: {type: String, required: true, min: 1},
    comic: [{ type: Schema.Types.ObjectId, ref: 'Comic', required: true }]
  }
);

//Export model
module.exports = mongoose.model('Comment', CommentSchema);