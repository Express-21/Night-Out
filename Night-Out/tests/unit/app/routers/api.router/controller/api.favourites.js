const { expect } = require( 'chai' );

const { init } =
    require( '../../../../../../server/app/routes/api.routes/controller' );

describe( 'api controller', () => {
    let data = null;
    let controller = null;
    let favs = [];

    let req = null;
    let res = null;

    describe( 'favourites route', () => {
        beforeEach( () => {
            req = require( '../../../../../utils/req-res' ).getRequestMock();
            res = require( '../../../../../utils/req-res' ).getResponseMock();
            favs = [
                {
                    userId: 1,
                    placeId: '1',
                },
                {
                    userId: 2,
                    placeId: '2',
                },
                {
                    userId: 1,
                    placeId: '3',
                },
            ];
            data = {
                favourites: {
                    getAll( filter ) {
                        return Promise.resolve(
                            favs.filter((fav) =>
                            fav.userId === filter.userId ) );
                    },
                },
            };
            controller = init( data );
        } );

        it( 'expect getFavourites to return the ids of the user', () => {
            req.user = { userId: 1 };
            req.query = {};
            return controller.getFavourites( req, res )
                .then( () => {
                    favs.forEach( ( fav ) => {
                        if ( fav.userId === req.user.id ) {
                            expect( res.body ).to.contain( fav.placeId );
                        } else {
                            expect( res.body ).to.not.contain( fav.placeId );
                        }
                    } );
                } );
        } );
    } );
} );
