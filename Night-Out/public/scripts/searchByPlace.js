/* global $ */

$('.btn-search').click(function(ev) {
    fetch( '/api/v1/places' )
        .then( ( res ) => {
            return res.json( {} );
        } )
        .then( ( names ) => {
            $( '#search' ).typeahead( { source: names } );
        } );
});
