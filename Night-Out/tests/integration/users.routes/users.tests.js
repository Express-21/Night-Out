const request = require( 'supertest' );
const { expect } = require( 'chai' );

describe( '/items tests', () => {
    const testIp = '127.0.0.1';
    let app = null;
    let db = null;

    const validUser = {
        username: 'GoshoIvanov',
        password: 'qwert1',
        email: 'gosho@abv.bg',
        nationality: 'bulgarian',
    };

    before( () => {
        let config = null;
        return Promise.resolve()
            .then( () => {
                return require( '../../../server/config/app.config.js' )
                    .init( testIp, 3010, '(test)' );
            } )
            .then( ( _config ) => {
                config = _config;
                return require( '../../../server/db' ).init( config.connectionString );
            } )
            .then( ( _db ) => {
                db = _db;
                return require( '../../../server/data' ).init( db );
            } )
            .then( ( data ) => {
                data.sessionStoreName = config.sessionStoreName;
                return require( '../../../server/app' ).init( data );
            } )
            .then( ( _app ) => {
                app = _app;
                app.listen( config.port, () =>
                    console.log( `Tes server running at: ${config.port}` ) );
                // browser.open(`config.port`);
            } );
    } );

    after( () => {
        return db.dropDatabase();
    } );

    describe( 'GET /users/register', () => {
        it( 'expect to return 200', ( done ) => {
            request( app )
                .get( '/users/register' )
                .expect( 200, done );
        } );
    } );

    describe( 'POST /users/register', () => {
        it( 'expect to add and redirect', ( done ) => {
            request( app )
                .post( '/users/register' )
                .send( validUser )
                .expect( 302 )
                .end( ( err, res ) => {
                    if ( err ) {
                        return done( err );
                    }
                    validUser.id = res.header.location.split( '/' ).pop();
                    expect( [12, 24] ).to.contain( validUser.id.length );
                    done();
                } );
        } );
    } );

    describe( '/api/v1/auth', () => {
        it( 'expect to be logged in and GET to return the user', ( done ) => {
            request( app )
                .get( '/api/v1/auth' )
                .expect( 200 )
                .end( ( err, res ) => {
                    if ( err ) {
                        return done( err );
                    }
                    expect( res.body.username ).to.equal( validUser.username );
                    done();
                } );
        } );
        it( 'expect DELETE to logout', ( done ) => {
            request( app )
                .delete( '/api/v1/auth' )
                .expect( 200, done );
        } );
        it( 'expect to be logged out and GET to return 401', ( done ) => {
            request( app )
                .get( '/api/v1/auth' )
                .expect( 401, done );
        } );
        it( 'expect POST to login', ( done ) => {

        } );
    } );


    describe( 'GET /users/login', () => {
        it( 'expect to return 200', ( done ) => {
            request( app )
                .get( '/users/login' )
                .expect( 200, done );
        } );
    } );


} );
