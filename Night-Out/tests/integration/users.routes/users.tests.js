const request = require( 'supertest' );
const { expect } = require( 'chai' );

describe( '/users tests', () => {
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
        it( 'expect to return 200', () => {
            return request( app )
                .get( '/users/register' )
                .expect( 200 );
        } );
    } );

    describe( 'POST /users/register', () => {
        it( 'expect to add and redirect', () => {
            return request( app )
                .post( '/users/register' )
                .send( validUser )
                .expect( 302 )
                .then( ( res ) => {
                    validUser.id = res.header.location.split( '/' ).pop();
                    expect( [12, 24] ).to.contain( validUser.id.length );
                } );
        } );
    } );

    describe( '/api/v1/auth', () => {
        it( 'expect DELETE to logout', () => {
            return request( app )
                .delete( '/api/v1/auth' )
                .expect( 200 );
        } );

        it( 'expect to be logged out and GET to return 401', () => {
            return request( app )
                .get( '/api/v1/auth' )
                .expect( 401 );
        } );

        it( 'expect POST to fail with invalidUser', () => {
            const invalidUser = {};
            Object.assign( invalidUser, validUser );
            invalidUser.password = '';
            return request( app )
                .post( '/api/v1/auth' )
                .send( invalidUser )
                .expect( 401 );
        } );

        it( 'expect POST to login with validUser', () => {
            return request( app )
                .post( '/api/v1/auth' )
                .send( validUser )
                .expect( 200 );
        } );
    } );


    describe( 'GET /users/login', () => {
        it( 'expect to return 200', () => {
            return request( app )
                .get( '/users/login' )
                .expect( 200 );
        } );
    } );


} );
