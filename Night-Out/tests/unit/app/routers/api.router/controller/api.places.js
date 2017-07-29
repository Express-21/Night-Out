const { expect } = require( 'chai' );

const { init } =
    require( '../../../../../../server/app/routes/api.routes/controller' );

describe( 'api controller', () => {
    let data = null;
    let controller = null;
    let items = [];

    let req = null;
    let res = null;

    describe( 'places route', () => {
        items = [
            { title: 'Place1' },
            { title: 'Place2' },
        ];

        beforeEach( () => {
            req = require( '../../../../../utils/req-res' ).getRequestMock();
            res = require( '../../../../../utils/req-res' ).getResponseMock();

            data = {
                places: {
                    getAll() {
                        return Promise.resolve( items );
                    },
                },
            };
            controller = init( data );
        } );

        it( 'expect getPlaces to return places names if no query', () => {
            req.query = {};
            return controller.getPlaces( req, res )
                .then( () => {
                    items.forEach( ( item ) => {
                        expect( res.body ).to.contain( item.title );
                    } );
                } );
        } );

        it( 'expect getPlaces to return 500 if bad data', () => {
            data = {
                places: {
                    getAll() {
                        return Promise.reject( 'fail' );
                    },
                },
            };
            controller = init( data );
            req.query = {};
            return controller.getPlaces( req, res )
                .then( () => {
                    expect( res.statusCode ).to.equal( 500 );
                } );
        } );

        describe( 'filter tests', () => {
            it( 'expect to return places on non-empty query', () => {
                data.places.filter = () => {
                    return Promise.resolve( items );
                };
                controller = init( data );
                req.query = { pagesize: 1 };
                return controller.getPlaces( req, res )
                    .then( () => {
                        items.forEach( ( item ) => {
                            expect( res.body ).to.deep.equal( items );
                        } );
                    } );
            } );
        } );
        describe( 'filter tests', () => {
            it( 'expect getPlaces to return 500 if fails to retrieve data', () => {
                data.places.filter = () => {
                    return Promise.reject( items );
                };
                controller = init( data );
                req.query = { pagesize: 1 };
                return controller.getPlaces( req, res )
                    .then( () => {
                        expect( res.statusCode ).to.equal( 500 );
                    } );
            } );
        } );
    } );
} );
