exports.comic_list = (req, res, next) => {
    //render comics list with requested sorting
    //if no sorting is requested, sort alphabetically
    let sorting = req.params.sorting;
    if (!sorting) {
        sorting = 'alphabetical'
    }
    res.send('NOT IMPLEMENTED: comic_list');
}