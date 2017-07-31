const passport = require( 'passport' );

const attach = (app, data) => {
    const controller = require( './controller' ).init( data );
    app.get( '/api/v1/towns', ( req, res ) => {
        return controller.getTowns( req, res );
    } );

    app.get( '/api/v1/auth', ( req, res ) => {
        if ( req.user ) {
            return res.status( 200 ).send( {
                id: req.user.id,
                username: req.user.username,
                email: req.user.email,
            } );
        }
        return res.status( 401 ).send( 'Not logged in!' );
    });

    app.post( '/api/v1/auth', ( req, res, next ) => {
        passport.authenticate( 'local', ( error, user ) => {
            if ( error ) {
                return next( error );
            }
            if ( !user ) {
                return res.status( 401 ).send( 'Log in failed!' );
            }
            req.logIn( user, ( err ) => {
                if ( err ) {
                    return next( err );
                }
                return res.status( 200 ).send( {
                    id: req.user.id,
                    username: req.user.username,
                    email: req.user.email,
                } );
            } );
        } )( req, res, next );
    } );

    app.delete( '/api/v1/auth', ( req, res ) => {
        req.logout();
        if ( req.user ) {
            return res.status( 500 ).send( 'Something went wrong! Still Logged in!' );
        }
        return res.status( 200 ).send( 'Successfully logged out!' );
    } );

    app.get( '/api/v1/users', ( req, res ) => {
        return controller.getNames( req, res );
    } );

    app.post( '/api/v1/users', ( req, res ) => {
        return controller.addUser( req, res );
    } );

    app.put( '/api/v1/users', ( req, res ) => {
        if ( !req.user ) {
            return res.status( 400 ).send( 'You need to be logged in!' );
        }
        return controller.updateUser( req, res );
    } );

    app.get( '/api/v1/places', ( req, res ) => {
        return controller.getPlaces( req, res );
    } );

    app.get( '/api/v1/favourites', ( req, res ) => {
        if ( !req.user ) {
            return res.status( 400 ).send( 'You need to be logged in!' );
        }
        return controller.getFavourites( req, res );
    } );

    app.post( '/api/v1/favourites', ( req, res ) => {
        if ( !req.user ) {
            return res.status( 400 ).send( 'You need to be logged in!' );
        }
        return controller.addFavourite( req, res );
    } );

    app.delete( '/api/v1/favourites', ( req, res ) => {
        if ( !req.user ) {
            return res.status( 400 ).send( 'You need to be logged in!' );
        }
        return controller.removeFavourite( req, res );
    } );

    app.get('/api/v1/comments', (req, res) =>{
        return controller.getComments(req, res);
    });
};

module.exports = attach;
