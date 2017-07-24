const config = require( './server/config/app.config.js' );

const async = () => {
    return Promise.resolve();
};

async()
    .then( () => require( './server/db' ).init( config.connectionString ) )
    .then( ( db ) => require( './server/data' ).init( db ) )
    .then( ( data ) => require( './server/app' ).init( data ) )
    .then( ( app ) => {
        app.listen( config.port, () =>
            console.log( `Server running at: ${config.port}` ) );
        // browser.open(`config.port`);
    } );