const request = require( 'supertest' );

describe( '/items tests', () => {
    const testIp = '127.0.0.1';
    let app = null;

    beforeEach( () => {
        let config = null;
        return Promise.resolve()
            .then( () => {
                return require( '../../../server/config/app.config.js' )
                    .init( testIp, 3010, '(test' );
            } )
            .then( ( _config ) => {
                config = _config;
                return require( '../../../server/db' ).init( config.connectionString );
            } )
            .then( ( db ) => require( '../../../server/data' ).init( db ) )
            .then( ( data ) => {
                data.sessionStoreName = config.sessionStoreName;
                return require( '../../../server/app' ).init( data );
            } )
            .then( ( _app ) => {
                app = _app;
                app.listen( config.port, () =>
                    console.log( `Server running at: ${config.port}` ) );
                // browser.open(`config.port`);
            } );
    } );

    describe( 'GET /home', () => {
        it( 'expect to return 200', ( done ) => {
            request( app )
                .get( '/home' )
                .expect( 200 )
                .end( ( err, res ) => {
                    if ( err ) {
                        return done( err );
                    }

                    return done();
                } );
        } );
    } );
} );
