const checkUserName = ( event ) => {
    fetch( '/api/usernames' )
        .then( ( res ) => {
            return res.json( {} );
        } )
        .then( ( users ) => {
            if ( users.indexOf( event.currentTarget.value ) === -1 ) {
                $( event.currentTarget ).removeClass( 'alert-text' );
                $( '#usernameError' ).remove();
                return true;
            }
            $( event.currentTarget ).addClass( 'alert-text' );
            $( '<span class="alert-text" id="usernameError">Username already exists!</span>' )
                .insertAfter( $( event.currentTarget ) );
            return true;
        } );
};

$( '#username' ).on( 'change', checkUserName );