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

        it( 'expect getNames to return towns', () => {
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

        it( 'expect getNames to return 500 if bad data', () => {
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
    } );
} );
