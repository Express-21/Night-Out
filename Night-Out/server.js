const async = () => {
    return Promise.resolve();
};

let config = null;

async()
    .then( () => {
        return require( './server/config/app.config.js' )
            .init( '13.59.153.216', 80 );
    } )
    .then( ( _config ) => {
        config = _config;
        return require( './server/db' ).init( config.connectionString );
    } )
    .then( ( db ) => require( './server/data' ).init( db ) )
    .then( ( data ) => {
        data.sessionStoreName = config.sessionStoreName;
        return require( './server/app' ).init( data );
    } )
    .then( ( app ) => {
        app.listen( config.port, () =>
            console.log( `Server running at: ${config.port}` ) );
        // browser.open(`config.port`);
    } );
