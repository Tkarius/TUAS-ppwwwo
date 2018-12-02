var Tag = require('../models/tag');
var Comic = require('../models/comic');
var async = require('async');

const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

// Display list of all Tags.
exports.tag_list = function (req, res, next) {

    Tag.find()
        .sort([['name', 'ascending']])
        .exec(function (err, list_tags) {
            if (err) { return next(err); }
            // Successful, so render.
            res.render('tag_list', { title: 'Tag List', list_tags: list_tags, user: req.user, pageTitle:'Tag List', pageDescription:'All the tags added to the service, click to see details' });
        });

};

// Display detail page for a specific tag.
exports.tag_detail = function (req, res, next) {

    async.parallel({
        tag: function (callback) {

            Tag.findById(req.params.id)
                .exec(callback);
        },

        tag_comics: function (callback) {
            Comic.find({ 'tag': req.params.id })
                .exec(callback);
        },

    }, function (err, results) {
        if (err) { return next(err); }
        if (results.tag == null) { // No results.
            var err = new Error('Tag not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render.
        res.render('tag_detail', { title: 'Tag Detail', tag: results.tag, tag_comics: results.tag_comics, user: req.user, pageTitle:results.tag.name, pageDescription:'Tag details' });
    });

};

// Display tag create form on GET.
exports.tag_create_get = function (req, res, next) {
    res.render('tag_form', { title: 'Create Tag', user:req.user, pageTitle:'Create tag', pageDescription:'Add new tags to organize comics by' });
};

// Handle Tag create on POST.
exports.tag_create_post = [

    (req, res, next) => {
        if (req.user == undefined || req.user.userId == undefined) {
            next(new Error('This feature is only for logged-in users!'));
        }
    },

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
            res.render('tag_form', { title: 'Create Tag', tag: tag, errors: errors.array(), user: req.user, pageTitle:'Create tag', pageDescription:'Add new tags to organize comics by'});
            return;
        }
        else {
            // Data from form is valid.
            // Check if Tag with same name already exists.
            Tag.findOne({ 'name': req.body.name })
                .exec(function (err, found_tag) {
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