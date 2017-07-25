console.log( 'here' )
fetch( '/api/towns' )
    .then( ( res ) => {
        return res.json( {} );
    } )
    .then( ( towns ) => {
        console.log( towns );
        $( '#city' ).typeahead( { source: towns } );
    } );