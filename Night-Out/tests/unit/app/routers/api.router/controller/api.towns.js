const { expect } = require( 'chai' );

const { init } =
    require( '../../../../../../server/app/routes/api.routes/controller' );

describe( 'api controller', () => {
    let data = null;
    let controller = null;
    let items = [];

    let req = null;
    let res = null;

    describe( 'towns route', () => {
        beforeEach( () => {
            req = require( '../../../../../utils/req-res' ).getRequestMock();
            res = require( '../../../../../utils/req-res' ).getResponseMock();
        } );

        it( 'expect getTowns to return towns', () => {
            items = [
                { name: 'Burgas' },
                { name: 'Varna' },
            ];
            data = {
                towns: {
                    getAll() {
                        return Promise.resolve( items );
                    },
                },
            };
            controller = init( data );

            return controller.getTowns( req, res )
                .then( () => {
                    items.forEach( ( item ) => {
                        expect( res.body ).to.contain( item.name );
                    } );
                } );
        } );

        it( 'expect getTowns to return 500 if bad data', () => {
            data = {
                towns: {
                    getAll() {
                        return Promise.reject( 'fail' );
                    },
                },
            };
            controller = init( data );

            return controller.getTowns( req, res )
                .then( () => {
                    expect( res.statusCode ).to.equal( 500 );
                } );
        } );
    } );
} );
