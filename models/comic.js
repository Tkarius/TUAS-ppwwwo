var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ComicSchema = new Schema(
  {
    title: {type: String, required: true},
    author: {type: String, required: true},
    description: {type: String, required: false},
    source: {type: String, required: true},
    image: {type: String, required: true},
    rating: {type:Number, default:0, required: false},
    tag: [{type: Schema.Types.ObjectId, ref: 'Tag', required: false}]
  }
);

// Virtual for comic's direct URL within the site - if we need this.
ComicSchema
.virtual('url')
.get(function () {
  return '/comics/comic' + this._id;
});

//Export model
module.exports = mongoose.model('Comic', ComicSchema);