$(function () {

    //now this idiot is called for every page this script is included for. As it is originally included in the
    //layout we might want to make some check or something to avoid extra work
    loadComicRating();

    console.log('More client side scripts loaded!');
    function loadComicRating() {
        let rating = $('.rating').data('rating');
        console.log('Rating is: ' + rating);
        rating = rating/10;
        let ratingOptions = {
            max_value : 10,
            initial_value:rating,
            step_size: 0.1,
            selected_symbol_type : 'utf8_star',
            readonly : true
        };


        $('.rating').rate(ratingOptions);
    }
});