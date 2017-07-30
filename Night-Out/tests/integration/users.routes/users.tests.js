const request = require( 'supertest' );
const { expect } = require( 'chai' );

describe( '/users tests', () => {
    const testIp = '127.0.0.1';
    let app = null;
    let db = null;

    const validUsers = [{
        username: 'GoshoIvanov',
        password: 'qwert1',
        email: 'gosho@abv.bg',
        nationality: 'bulgarian',
    },
        {
            username: 'IvanGoshov',
            password: 'qwert1',
            email: 'ivan@abv.bg',
            nationality: 'bulgarian',
        }];

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
            const validUser = validUsers[0];
            return request( app )
                .post( '/users/register' )
                .send( validUser )
                .expect( 302 )
                .then( ( res ) => {
                    validUser.id = res.header.location.split( '/' ).pop();
                    expect( [12, 24] ).to.contain( validUser.id.length );
                } );
        } );

        it( 'expect second attempt with same user to fail', () => {
            const validUser = validUsers[0];
            return request( app )
                .post( '/users/register' )
                .send( validUser )
                .expect( 302 )
                .expect( 'location', '/users/register' );
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
            Object.assign( invalidUser, validUsers[0] );
            invalidUser.password = '';
            return request( app )
                .post( '/api/v1/auth' )
                .send( invalidUser )
                .expect( 401 );
        } );

        it( 'expect POST to login with validUser', () => {
            const validUser = validUsers[0];
            return request( app )
                .post( '/api/v1/auth' )
                .send( validUser )
                .expect( 200 );
        } );
    } );


    describe( '/users/login', () => {
        it( 'expect to return 200', () => {
            return request( app )
                .get( '/users/login' )
                .expect( 200 );
        } );

        it( 'expect to redirect to the user details page', () => {
            const validUser = validUsers[0];
            return request( app )
                .post( '/users/login' )
                .send( validUser )
                .expect( 302 )
                .then( ( res ) => {
                    expect( res.header.location ).to.contain( validUser.id );
                } );
        } );
    } );

    describe( '/users/edit', () => {
        it( 'expect user edit page to not be accessible', () => {
            const validUser = validUsers[0];
            return request( app )
                .get( `/users/edit/${validUser.id}` )
                .expect( 302 )
                .expect( 'location', '/users/login' );
        } );
    } );

    describe( '/users/all', () => {
        it( 'expect users page to not be accessible', () => {
            return request( app )
                .get( '/users/all' )
                .expect( 302 )
                .expect( 'location', '/users/login' );
        } );
    } );

    describe( '/users/:id', () => {
        it( 'expect user details page to be accessible', () => {
            const validUser = validUsers[0];
            return request( app )
                .get( `/users/${validUser.id}` )
                .expect( 200 );
        } );
        it( 'expect user details page to fail with wrong id', () => {
            return request( app )
                .get( `/users/no_such_user` )
                .expect( 302 )
                .expect( 'location', '/404' );
        } );
    } );

    describe( '/api/users', () => {
        it( 'expect POST to fail with existing user', () => {
            const validUser = validUsers[0];
            return request( app )
                .post( '/api/v1/users' )
                .send( validUser )
                .expect( 400 );
        } );
        it( 'expect POST to succseed with valid user', () => {
            const validUser = validUsers[1];
            return request( app )
                .post( '/api/v1/users' )
                .send( validUser )
                .expect( 200 );
        } );
        it( 'expect GET to return two names', () => {
            return request( app )
                .get( '/api/v1/users' )
                .expect( 200 )
                .then( ( res ) => {
                    validUsers.forEach( ( user ) => {
                        expect( res.body ).to.contain( user.username );
                    } );
                } );
        } );

    } );
} );
