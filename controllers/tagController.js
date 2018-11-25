var Tag = require('../models/tag');
var Comic = require('../models/comic');
var async = require('async');

const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

// Display list of all Tags.
exports.tag_list = function(req, res, next) {

  Tag.find()
    .sort([['name', 'ascending']])
    .exec(function (err, list_tags) {
      if (err) { return next(err); }
      // Successful, so render.
      res.render('tag_list', { title: 'Tag List', list_tags:  list_tags});
    });

};

// Display detail page for a specific tag.
exports.tag_detail = function(req, res, next) {

    async.parallel({
        tag: function(callback) {

            Tag.findById(req.params.id)
              .exec(callback);
        },

        tag_comics: function(callback) {
          Comic.find({ 'tag': req.params.id })
          .exec(callback);
        },

    }, function(err, results) {
        if (err) { return next(err); }
        if (results.tag==null) { // No results.
            var err = new Error('Tag not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render.
        res.render('tag_detail', { title: 'Tag Detail', tag: results.tag, tag_comics: results.tag_comics } );
    });

};

// Display tag create form on GET.
exports.tag_create_get = function(req, res, next) {
    res.render('tag_form', { title: 'Create Tag'});
};

// Handle Tag create on POST.
exports.tag_create_post = [

    // Validate that the name field is not empty.
    body('name', 'Tag name required').isLength({ min: 1 }).trim(),

    // Sanitize (trim and escape) the name field.
    sanitizeBody('name').trim().escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a tag object with escaped and trimmed data.
        var tag = new Tag(
          { name: req.body.name }
        );


        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values/error messages.
            res.render('tag_form', { title: 'Create Tag', tag: tag, errors: errors.array()});
        return;
        }
        else {
            // Data from form is valid.
            // Check if Tag with same name already exists.
            Tag.findOne({ 'name': req.body.name })
                .exec( function(err, found_tag) {
                     if (err) { return next(err); }

                     if (found_tag) {
                         // Tag exists, redirect to its detail page.
                         res.redirect(found_tag.url);
                     }
                     else {

                         tag.save(function (err) {
                           if (err) { return next(err); }
                           // Tag saved. Redirect to tag detail page.
                           res.redirect(tag.url);
                         });

                     }

                 });
        }
    }
];

/* Display Tag delete form on GET.
exports.tag_delete_get = function(req, res, next) {

    async.parallel({
        tag: function(callback) {
            Tag.findById(req.params.id).exec(callback);
        },
        tag_comics: function(callback) {
            Comic.find({ 'tag': req.params.id }).exec(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.tag==null) { // No results.
            res.redirect('/tags/tag');
        }
        // Successful, so render.
        res.render('tag_delete', { title: 'Delete Tag', tag: results.tag, tag_comics: results.tag_comics } );
    });

};

// Handle Genre delete on POST.
exports.genre_delete_post = function(req, res, next) {

    async.parallel({
        genre: function(callback) {
            Genre.findById(req.params.id).exec(callback);
        },
        genre_books: function(callback) {
            Book.find({ 'genre': req.params.id }).exec(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        // Success
        if (results.genre_books.length > 0) {
            // Genre has books. Render in same way as for GET route.
            res.render('genre_delete', { title: 'Delete Genre', genre: results.genre, genre_books: results.genre_books } );
            return;
        }
        else {
            // Genre has no books. Delete object and redirect to the list of genres.
            Genre.findByIdAndRemove(req.body.id, function deleteGenre(err) {
                if (err) { return next(err); }
                // Success - go to genres list.
                res.redirect('/catalog/genres');
            });

        }
    });

};

// Display Genre update form on GET.
exports.genre_update_get = function(req, res, next) {

    Genre.findById(req.params.id, function(err, genre) {
        if (err) { return next(err); }
        if (genre==null) { // No results.
            var err = new Error('Genre not found');
            err.status = 404;
            return next(err);
        }
        // Success.
        res.render('genre_form', { title: 'Update Genre', genre: genre });
    });

};

//
Handle Genre update on POST.
exports.genre_update_post = [
   
    // Validate that the name field is not empty.
    body('name', 'Genre name required').isLength({ min: 1 }).trim(),
    
    // Sanitize (trim and escape) the name field.
    sanitizeBody('name').trim().escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request .
        const errors = validationResult(req);

    // Create a genre object with escaped and trimmed data (and the old id!)
        var genre = new Genre(
          {
          name: req.body.name,
          _id: req.params.id
          }
        );


        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values and error messages.
            res.render('genre_form', { title: 'Update Genre', genre: genre, errors: errors.array()});
        return;
        }
        else {
            // Data from form is valid. Update the record.
            Genre.findByIdAndUpdate(req.params.id, genre, {}, function (err,thegenre) {
                if (err) { return next(err); }
                   // Successful - redirect to genre detail page.
                   res.redirect(thegenre.url);
                });
        }
    }
];
*/