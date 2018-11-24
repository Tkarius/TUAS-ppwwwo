var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ComicSchema = new Schema(
  {
    title: {type: String, required: true},
    author: {type: Schema.Types.ObjectId, ref: 'Author', required: true},
    description: {type: String, required: false},
    url: {type: String, required: false},
    tag: [{type: Schema.Types.ObjectId, ref: 'Tag', required: false}]
  }
);

// Virtual for book's URL - if we need this.
BookSchema
.virtual('url')
.get(function () {
  return '/comics/comic' + this._id;
});

//Export model
module.exports = mongoose.model('Comic', ComicSchema);