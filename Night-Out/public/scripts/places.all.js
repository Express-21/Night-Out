fetch( '/api/places/names' )
    .then( ( res ) => {
        return res.json( {} );
    } )
    .then( ( names ) => {
        console.log( names );
        $( '#search' ).typeahead( { source: names } );
    } );