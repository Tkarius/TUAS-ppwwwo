var mongoose = require('mongoose');
var moment = require('moment');

var Schema = mongoose.Schema;

var CommentSchema = new Schema(
  {
    user: {type: String, required: true},
    time_posted: {type: Date, required: true},
    content: {type: String, required: true, min: 1},
    comic: [{ type: Schema.Types.ObjectId, ref: 'Comic', required: true }]
  }
);

CommentSchema
.virtual('time_posted_formatted')
.get(function () {
  return moment(this.time_posted).format('HH:mm - DD/MM/YYYY');
});


//Export model
module.exports = mongoose.model('Comment', CommentSchema);