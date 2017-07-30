/* global $ */

$(document).ready(function() {

    $('#fav').click(function(ev) {
        $(this).toggleClass('added');
    });

    const placeId = window.location.pathname.split('/').pop();
    fetch( '/api/v1/favourites', { credentials: 'include' } )
        .then((res) => {
            return res.json({});
        })
        .then((fav) => {
            if (fav.indexOf(placeId) === -1) {
                $('#fav').removeClass('added');
            }
            else {
                $('#fav').addClass('added');
            }
        });
});


