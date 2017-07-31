/* global $ */

const getFavourites = () => {
    return fetch( '/api/v1/favourites', { credentials: 'include' } )
        .then( ( res ) => {
            if ( res.status === 200 ) {
                return res.json( {} );
            }
            return [];
        } )
        .catch( ( err ) => {
            console.log( err );
        } );
};

$(document).ready(function() {
const placeId = window.location.pathname.split('/').pop();
    function checkIfAdded() {
        getFavourites()
            .then((fav) => {
                if (fav.indexOf(placeId) === -1) {
                    //fetch('/api/v1/favourites',
                    //    {
                    //        head: 'POST',
                    //        body: { placeId },
                    //        credentials: 'include',
                    //    });
                    $('#fav').attr('class', '');
                } else {
                    $( '#fav' ).attr( 'class', 'added' );
                }
            });
    }

    window.onload = checkIfAdded;

    $('#fav').click(function(ev) {
        getFavourites()
            .then((fav) => {
                if (fav.indexOf(placeId) === -1) {
                    fetch('/api/v1/favourites',
                        {
                            method: 'POST',
                            headers: {
                                'content-type': 'application/json',
                            },
                            body: JSON.stringify( { placeId } ),
                            credentials: 'include',
                        } )
                        .then( ( res )=> {
                            if ( res.status === 200 ) {
                                $( '#fav' ).attr( 'class', 'added' );
                            }
                        });
                } else {
                    fetch( '/api/v1/favourites',
                        {
                            method: 'DELETE',
                            headers: {
                                'content-type': 'application/json',
                            },
                            body: JSON.stringify( { placeId } ),
                            credentials: 'include',
                        } )
                        .then( ( res )=> {
                            if ( res.status === 200 ) {
                                $( '#fav' ).attr( 'class', '' );
                            }
                        } );
                }
            });
    });
});


