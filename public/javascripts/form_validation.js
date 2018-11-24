/**
 * This file for now holds only form validation. If something else is included, we might want to rename the file
 * if it is renamed, change the layout.pug to include the correctly named file!
 */
$(function () {
    console.log('Custom javascript loaded!');

    $('#register').validate({
        rules: {
            'username': {
                required: true
            },
            'password': {
                required: true,
                minlength: 8
            },
            'password-verify': {
                equalTo: '#register-password'
            }
        }
    });
});