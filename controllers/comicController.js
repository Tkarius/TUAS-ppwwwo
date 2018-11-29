var Comic = require('../models/comic');
var Author = require('../models/author');
var Tag = require('../models/tag');
var Comment = require('../models/comment');

var async = require('async');

const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

exports.comic_list = (req, res, next) => {
    //render comics list with requested sorting
    //if no sorting is requested, sort alphabetically
    let sorting = req.params.sorting;
    if (!sorting) {
        sorting = 'title'
    }

    let user = {
        username: 'Esteri'
    }

    Comic.find({})
        .sort(sorting)
        .exec((err, comics) => {
            if (err) { return next(err); }
            //Successful, so render
            res.render('comic_list', {pageTitle:'Browse Comics', pageDescription:'Browse added comics', comics:comics, user:user});
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
        },
    }, (err, results) => {
        if (err) { return next(err); }
        if (results.comic == null) { // No results :(
            var err = new Error('Comic not found');
            err.status = 404;
            return next(err);
        }
        
        results.comic.source = decodeURI(results.comic.source);
        results.comic.image = decodeURI(results.comic.image);
        console.log(results);
        // Successful, let's render this
        res.render('comic_details', {pageTitle:results.comic.title, pageDescription:'View comic details', comic:results.comic, comments:results.comments})
    });
}

exports.comic_add_get = (req, res, next) => {
    //renders page for adding a new comic. 
    //checks if user is logged in before rendering. If not, gives error

    //dummy object for testing the view! Fetch real data form MongoDB
    async.parallel({
        tags: function(callback) {
            Tag.find(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        res.render('comic_form', { title: 'Create comic', tags: results.tags });
    });
};


exports.comic_add_post = [
    //adds a new comic
    //checks if user is logged in. If not, gives error

    (req, res, next) => {
        if(!(req.body.tag instanceof Array)){
            if(typeof req.body.tag === 'undefined')
            req.body.tag=[];
            else
            req.body.tag=new Array(req.body.tag);
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
                image: encodeURI(req.body.image),
                source: encodeURI(req.body.source),
                tag: req.body.tag,
                rating: req.body.rating,
            }
        );
            
        if (!errors.isEmpty()) {
            async.parallel({
                tags: function(callback) {
                    Tag.find(callback);
                },
            }, function(err, results) {
                if (err) { return next(err); }

                for (let i=0; i < results.tag.length; i++) {
                    if (comic.tag.indexOf(results.tag[i]._id) > -1) {
                        results.tag[i].checked='true';
                    }
                }
                res.render('comic_form', { title: 'Create Comic', tags: results.tag, comic: comic, errors: errors.array() });
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

exports.author_list = (req, res, next) => {
    //renders page with list of authors
    res.send('NOT IMPLEMENTED: author_list');
}

exports.author_details = (req, res, next) => {
    //renders page with author details and listing of comics by the author
    res.send('NOT IMPLEMENTED: author_details');
}