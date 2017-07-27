const passport = require( 'passport' );

const attach = (app, data) => {
    app.get( '/api/v1/towns', ( req, res ) => {
        data.towns.getAll()
            .then( ( towns ) => {
                towns = towns.map( ( town ) => town.name );
                return res.send( towns );
            } )
            .catch( ( err ) => {
                return res.status( 500 ).send( 'Could not retrieve data! ' + err );
            } );
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
        data.users.getAll()
            .then( ( users ) => {
                users = users.map( ( user ) => user.username );
                return res.send( users );
            } )
            .catch( ( err ) => {
                return res.status( 500 ).send( 'Could not retrieve data! ' + err );
            } );
    } );

    app.post( '/api/v1/users', ( req, res ) => {
        const model = {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            stringProfilePicture: 'user.png',
            nationality: req.body.nationality,
            favourites: [],
        };

        if ( !data.users.validator.isValid( model ) ) {
            return res.status( 400 ).send( 'Data does not meet requirements!' );
        }

        data.users.findUser( model.username )
            .then( ( user ) => {
                if ( user ) {
                    return Promise.reject( 'Username already exists!' );
                }
                return data.users.filter( { email: model.email } );
            } )
            .then( ( users ) => {
                if ( users.length ) {
                    return Promise.reject( 'Email already used!' );
                }
                return data.users.create( model );
            } )
            .then( () => {
                return res.status( 200 ).send( 'User successfully added!' );
            } )
            .catch( ( err ) => {
                return res.status( 400 ).send( err );
            } );
    } );

    app.get( '/api/v1/places', ( req, res ) => {
        if ( Object.keys( req.query ).length === 0 ) {
            data.places.getAll()
                .then( ( places ) => {
                    places = places.map( ( place ) => place.title );
                    return res.status( 200 ).send( places );
                } )
                .catch( ( err ) => {
                    return res.status( 500 ).send( 'Could not retrieve data! ' + err );
                } );
        }
        const filter = {};
        if ( req.query.name ) {
            if ( req.query.strict === 'true' ) {
                filter.title = req.query.name;
            } else {
                filter.title = { $regex: `.*${req.query.name}.*` };
            }
        }
        if ( req.query.category ) {
            filter.category = req.query.category;
        }
        if ( req.query.town ) {
            filter.town = req.query.town;
        }
        data.places.filter( filter )
            .then( ( places ) => {
                return res.status( 200 ).send( places );
            } )
            .catch( ( err ) => {
                return res.status( 500 ).send( 'Could not retrieve data! ' + err );
            } );
    } );
};

module.exports = attach;
