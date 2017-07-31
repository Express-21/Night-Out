/* global $ */
fetch( '/api/v1/places' )
    .then( ( res ) => {
        return res.json( {} );
    } )
    .then( ( names ) => {
        $( '#search' ).typeahead( { source: names } );
    } );

$( '.btn-search' ).click( () => {
    const name = $( '#search' ).val();
    const town = $( '#town-select' ).val();

    $( '.place-container' ).each( ( index, element ) => {
        const placeTitle = $( element ).find( '.title > a' ).text().trim();
        const placeTown = $( element ).find( '.place-location' ).text().trim();

        const hide = (
            ( town !== '' ) && ( town !== placeTown ) ) ||
            ( ( name !== '' ) &&
            ( placeTitle.toLowerCase().indexOf( name.toLowerCase() ) === -1 ));
        if ( hide ) {
            $( element ).hide();
        } else {
            $( element ).show();
        }
    } );
});
