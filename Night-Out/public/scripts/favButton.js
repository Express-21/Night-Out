/* global $ */

$(document).ready(function() {
const placeId = window.location.pathname.split('/').pop();
    function checkIfAdded() {
        fetch('/api/v1/favourites', { credentials: 'include' })
            .then((res) => {
                return res.json({});
            })
            .then((fav) => {
                if (fav.indexOf(placeId) === -1) {
                    fetch('/api/v1/favourites',
                        {
                            head: 'POST',
                            body: { placeId },
                            credentials: 'include',
                        });
                    $('#fav').attr('class', '');
                }
                else {
                $('#fav').attr('class', 'added');
                }
            });
    }

    window.onload = checkIfAdded;

    $('#fav').click(function(ev) {
        fetch('/api/v1/favourites', { credentials: 'include' })
            .then((res) => {
                return res.json({});
            })
            .then((fav) => {
                if (fav.indexOf(placeId) === -1) {
                    fetch('/api/v1/favourites',
                        {
                            head: 'POST',
                            body: { placeId },
                            credentials: 'include',
                        });
                    $('#fav').attr('class', 'added');
                }
                else {
                    fetch('/api/v1/favourites', {
                        head: 'DELETE',
                        credentials: 'include',
                    });
                }
                $('#fav').attr('class', '');
            });
    });
});


