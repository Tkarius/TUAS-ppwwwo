var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ComicSchema = new Schema(
  {
    title: {type: String, required: true},
    author: {type: String, required: true},
    description: {type: String, required: false},
    source: {type: String, required: true},
    image: {type: String, required: true},
    rating: [Number],
    tag: [{type: Schema.Types.ObjectId, ref: 'Tag', required: false}]
  }
);

// Virtual for comic's direct URL within the site - if we need this.
ComicSchema
.virtual('url')
.get(function () {
  return '/comics/comic/' + this._id;
});

ComicSchema
.virtual('averageRating')
.get(()=>{
  if (this.rating === undefined || this.rating.length < 1) {
    return 0;
  } else {
    return average(this.rating);
  }
})

//Export model
module.exports = mongoose.model('Comic', ComicSchema);