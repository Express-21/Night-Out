/* global $ */
fetch( '/api/v1/places' )
    .then( ( res ) => {
        return res.json( {} );
    } )
    .then( ( names ) => {
        $( '#search' ).typeahead( { source: names } );
    } );

$('.btn-search').click(function(ev) {

});
