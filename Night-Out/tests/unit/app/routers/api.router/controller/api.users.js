const { expect } = require( 'chai' );

const { init } =
    require( '../../../../../../server/app/routes/api.routes/controller' );

describe( 'api controller', () => {
    let data = null;
    let controller = null;
    let usersList = [];

    let req = null;
    let res = null;

    describe( 'users route', () => {
        beforeEach( () => {
            req = require( '../../../../../utils/req-res' ).getRequestMock();
            res = require( '../../../../../utils/req-res' ).getResponseMock();
        } );

        it( 'expect getNames to return all names', () => {
            usersList = [
                { username: 'Nikolay' },
                { username: 'Michaela' },
            ];
            data = {
                users: {
                    getAll() {
                        return Promise.resolve( usersList );
                    },
                },
            };
            controller = init( data );

            return controller.getNames( req, res )
                .then( () => {
                    usersList.forEach( ( user ) => {
                        expect( res.body ).to.contain( user.username );
                    } );
                } );
        } );

        it( 'expect getNames to return 500 if fails to retrieve data', () => {
            data = {
                users: {
                    getAll() {
                        return Promise.reject( 'fail' );
                    },
                },
            };
            controller = init( data );
            return controller.getNames( req, res )
                .then( () => {
                    expect( res.statusCode ).to.equal( 500 );
                } );
        } );

        it( 'expect addUser to return 400 if bad data', () => {
            data = {
                users: {
                    validator: {
                        isValid: () => {
                            return false;
                        },
                    },
                },
            };
            controller = init( data );
            req.body = {};
            return controller.addUser( req, res )
                .catch( ( err ) => {
                    expect( err.statusCode ).to.equal( 400 );
                } );
        } );

        describe( 'addUser detailed tests', () => {
            beforeEach( () => {
                usersList = [
                    {
                        username: 'Nikolay',
                        email: 'nikolay@email.com',
                    },
                    {
                        username: 'Michaela',
                        email: 'michaela@email.com',
                    },
                ];
                data = {
                    users: {
                        validator: {
                            isValid: () => {
                                return true;
                            },
                        },
                        findUser( username ) {
                            const index = usersList.findIndex( ( user ) => {
                                return (user.username === username);
                            } );
                            return Promise.resolve( usersList[index] );
                        },
                        filter( filter ) {
                            return Promise.resolve( usersList.filter( ( user ) => {
                                return (user.email === filter.email);
                            } ) );
                        },
                        create( model ) {
                            usersList.push( model );
                            return Promise.resolve( model );
                        },
                    },
                };
                controller = init( data );
            } );

            it( 'expect addUser to fail on existing user', () => {
                req.body = {
                    username: usersList[0].username,
                };
                return controller.addUser( req, res )
                    .then( () => {
                        expect( res.statusCode ).to.equal( 400 );
                        expect( res.body ).to.equal( 'Username already exists!' );
                    } );
            } );

            it( 'expect addUser to fail on existing email', () => {
                req.body = {
                    email: usersList[0].email,
                };
                return controller.addUser( req, res )
                    .then( () => {
                        expect( res.statusCode ).to.equal( 400 );
                        expect( res.body ).to.equal( 'Email already used!' );
                    } );
            } );
            it( 'expect addUser to successfully add unique user', () => {
                req.body = {};
                return controller.addUser( req, res )
                    .then( () => {
                        expect( res.statusCode ).to.equal( 200 );
                        expect( res.body ).to.equal( 'User successfully added!' );
                    } );
            } );

        } );
    } );
} );
