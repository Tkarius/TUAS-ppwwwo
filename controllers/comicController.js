exports.comic_list = (req, res, next) => {
    //render comics list with requested sorting
    //if no sorting is requested, sort alphabetically
    let sorting = req.params.sorting;
    if (!sorting) {
        sorting = 'alphabetical'
    }
    res.send('NOT IMPLEMENTED: comic_list');
}

exports.comic_details = (req, res, next) => {
    //renders page for comic details
    res.send('NOT IMPLEMENTED: comic_details');
}

exports.comic_add_get = (req, res, next) => {
    //renders page for adding a new comic. 
    //checks if user is logged in before rendering. If not, gives error
    res.send('NOT IMPLEMENTED: comic_add_get');
}

exports.comic_add_post = (req, res, next) => {
    //adds a new comic
    //checks if user is logged in. If not, gives error
    res.send('NOT IMPLEMENTED: comic_add_post');
}

exports.author_list = (req, res, next) => {
    //renders page with list of authors
    res.send('NOT IMPLEMENTED: author_list');
}

exports.author_details = (req, res, next) => {
    //renders page with author details and listing of comics by the author
    res.send('NOT IMPLEMENTED: author_details');
}