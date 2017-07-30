/* global $ */

$('.btn-search').click(function(ev) {
    fetch( '/api/v1/users' )
        .then( ( res ) => {
            return res.json( {} );
        } )
        .then( ( names ) => {
            $( '#search' ).typeahead( { source: names } );
        });
});
