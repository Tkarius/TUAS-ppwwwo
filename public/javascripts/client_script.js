$(function () {

    //now this idiot is called for every page this script is included for. As it is originally included in the
    //layout we might want to make some check or something to avoid extra work
    loadComicRating();

    console.log('More client side scripts loaded!');
    function loadComicRating() {
        let rating = $('.comicRating').data('rating');
        let comicID = $('.comicRating').data('comicid');
        console.log('Rating is: ' + rating + 'ID is: ' + comicID);
        let ratingOptions = {
            max_value : 10,
            initial_value:rating,
            step_size: 0.1,
            selected_symbol_type : 'utf8_star',
            readonly : false,
            change_once: true,
            ajax_method: 'POST',
            url: '/comics/comic/' + comicID + '/rate'
        };

        $('.comicRating').on('updateSuccess', (event, data) => {
            console.log('Successful update! Data: ');
            console.log(data);
        })


        $('.comicRating').rate(ratingOptions);
        //$('.comicRating').css({'width':'300px', 'height':'20px'}) //uncomment to override rater.js inline styles
    }
});