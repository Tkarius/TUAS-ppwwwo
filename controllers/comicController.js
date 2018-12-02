var Comic = require('../models/comic');
//var Author = require('../models/author');
var Tag = require('../models/tag');
var Comment = require('../models/comment');
var User = require('../models/user');

var async = require('async');
var Entities = require('html-entities').AllHtmlEntities;

const htmlEntities = new Entities();

const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

exports.comic_list = (req, res, next) => {
    //render comics list with requested sorting
    //if no sorting is requested, sort alphabetically
    let sorting = req.query.sorting;
    console.log('Sorting: ' + sorting);
    if (sorting === undefined) {
        sorting = 'title'
    }

    Comic.find({})
        .sort(sorting)
        .exec((err, comics) => {
            if (err) { return next(err); }
            for (let comic of comics) {
                comic.author = htmlEntities.decode(comic.author);
                comic.title = htmlEntities.decode(comic.title);
            }          
            //Successful, so render
            res.render('comic_list', { pageTitle: 'Browse Comics', pageDescription: 'Browse added comics', comics: comics, user: req.user });
        });
}

exports.comic_details = (req, res, next) => {
    let comicId = req.params.id;

    //fetch comic details from mongoDB
    async.parallel({
        comic: (callback) => {

            Comic.findById(comicId)
                .populate('tag')
                .exec(callback);
        },
        comments: (callback) => {

            Comment.find({ 'comic': comicId })
                .exec(callback);
        }

    }, (err, results) => {
        if (err) { return next(err); }
        if (results.comic == null) { // No results :(
            var err = new Error('Comic not found');
            err.status = 404;
            return next(err);
        }

        //run html-entities decoder to all fields. Maybe we want to wrap this into a function?
        results.comic.description = htmlEntities.decode(results.comic.description);
        results.comic.author = htmlEntities.decode(results.comic.author);
        results.comic.title = htmlEntities.decode(results.comic.title);
        results.comic.source = htmlEntities.decode(results.comic.source);
        results.comic.image = htmlEntities.decode(results.comic.image);

        let averageRating = 0;

        for (let value of results.comic.rating) {
            averageRating += value;
        }

        averageRating = averageRating / results.comic.rating.length

        results.comic.averageRating = averageRating;
        console.log(results);

        // Successful, let's render this - AT THE END OF THIS LINE == RESULTS.USER IS ALSO PLACEHOLDER
        res.render('comic_details', { pageTitle: results.comic.title, pageDescription: 'View comic details', comic: results.comic, comments: results.comments, user: req.user })
    });
}

exports.comic_add_get = (req, res, next) => {
    console.log(req.user);
    if (req.user == undefined || req.user.userId == undefined) {
        next(new Error('This feature is only for logged-in users!'));
    };
    async.parallel({
        tags: function (callback) {
            Tag.find(callback);
        },
    }, function (err, results) {
        if (err) { return next(err); }
        res.render('comic_form', { title: 'Create comic', tags: results.tags, user: req.user, pageTitle:'Create comic', pageDescription:'Add new comics for others to enjoy and review' });
    });
};


exports.comic_add_post = [
    //adds a new comic
    //checks if user is logged in. If not, gives error

    (req, res, next) => {
        if (req.user == undefined || req.user.userId == undefined) {
            next(new Error('This feature is only for logged-in users!'));
        }
        next();
    },
    (req, res, next) => {
        if (!(req.body.tag instanceof Array)) {
            if (typeof req.body.tag === 'undefined')
                req.body.tag = [];
            else
                req.body.tag = new Array(req.body.tag);
        }
        next();
    },

    body('title', 'Title must not be empty').isLength({ min: 1 }).trim(),
    body('author', 'Author must not be empty').isLength({ min: 1 }).trim(),
    body('source', 'Source must not be empty').isLength({ min: 1 }).trim(),
    body('image', 'Image must not be empty').isLength({ min: 1 }).trim(),

    sanitizeBody('*').trim().escape(),

    (req, res, next) => {

        const errors = validationResult(req);

        var comic = new Comic(
            {
                title: req.body.title,
                description: req.body.description,
                author: req.body.author,
                image: req.body.image,
                source: req.body.source,
                tag: req.body.tag,
                rating: req.body.rating,
            }
        );

        if (!errors.isEmpty()) {
            async.parallel({
                tags: function (callback) {
                    Tag.find(callback);
                },
            }, function (err, results) {
                if (err) { return next(err); }

                for (let i = 0; i < results.tag.length; i++) {
                    if (comic.tag.indexOf(results.tag[i]._id) > -1) {
                        results.tag[i].checked = 'true';
                    }
                }
                res.render('comic_form', { title: 'Create Comic', tags: results.tag, comic: comic, errors: errors.array(), user: req.user, pageTitle:'Create Comic', pageDescription:'Add new comics for others to enjoy and review' });
            });
            return;
        }
        else {
            comic.save(function (err) {
                if (err) { return next(err); }
                res.redirect(comic.url);
            });
        }

    }
];

exports.comic_rate_post = (req, res, next) => {
    let comicId = req.params.id;
    console.log('Comic id: ' + comicId);
    let newRating = req.body.value;
    Comic.findByIdAndUpdate(comicId, { $push: { rating: newRating } }, { new: true }, (err, comic) => {
        if (err) { return next(err); }
        console.log(comic);
        let comicRating = 0;

        for (value of comic.rating) {
            comicRating += value;
        }

        comicRating = comicRating / comic.rating.length

        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({ rating: comicRating }));
    });
}

// Handle comment create on POST.
exports.comment_add_post = [

    (req, res, next) => {
        if (req.user == undefined || req.user.userId == undefined) {
            next(new Error('This feature is only for logged-in users!'));
        }
        next();
    },
    // Validate that the comment field is not empty.
    body('content', 'Comment content required').isLength({ min: 1 }).trim(),

    // Sanitize (trim and escape) the name field.
    sanitizeBody('content').trim().escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        var currentTime = new Date();
        // Create a comment object with escaped and trimmed data.
        var comment = new Comment(
            {
                user: req.body.username,
                time_posted: currentTime,
                content: req.body.content,
                comic: req.body.comicid

            }
        );

        //redirect back to comic detail page after posting comment
        Comic.findById(req.body.comicid, function (err, redirectComic) {

            comment.save(function (err) {
                if (err) { return next(err); }
                // Comment saved. Redirect to tag detail page.
                res.redirect(redirectComic.url);
            });

            return;
        });

    }
];