var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ComicSchema = new Schema(
  {
    title: {type: String, required: true},
    author: {type: Schema.Types.ObjectId, ref: 'Author', required: true},
    description: {type: String, required: false},
<<<<<<< HEAD
    url: {type: String, required: true},
=======
    source: {type: String, required: true},
    image: {type: String, required: true},
>>>>>>> 94443d33ed9113b55b3450c0ddd5d0d107313580
    tag: [{type: Schema.Types.ObjectId, ref: 'Tag', required: false}]
  }
);

// Virtual for comic's direct URL within the site - if we need this.
BookSchema
.virtual('url')
.get(function () {
  return '/comics/comic' + this._id;
});

//Export model
module.exports = mongoose.model('Comic', ComicSchema);