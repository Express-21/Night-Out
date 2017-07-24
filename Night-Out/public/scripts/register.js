const checkUserName = ( event ) => {
    fetch( '/api/usernames' )
        .then( ( res ) => {
            return res.json( {} );
        } )
        .then( ( users ) => {
            if ( users.indexOf( event.currentTarget.value ) === -1 ) {
                $( event.currentTarget ).removeClass( 'alert-text' );
                return true;
            }
            $( event.currentTarget ).addClass( 'alert-text' );
            event.currentTarget.value += ' (username already exists)';
            return true;
        } );
};

$( '#username' ).on( 'change', checkUserName );