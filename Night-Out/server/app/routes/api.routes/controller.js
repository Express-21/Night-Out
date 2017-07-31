const init = ( data ) => {
    const controller = {
        getTowns( req, res ) {
            return data.towns.getAll()
                .then( ( towns ) => {
                    towns = towns.map( ( town ) => town.name );
                    return res.send( towns );
                } )
                .catch( ( err ) => {
                    return res.status( 500 )
                        .send( 'Could not retrieve data! ' + err );
                } );
        },
        getNames( req, res ) {
            return data.users.getAll()
                .then( ( users ) => {
                    users = users.map( ( user ) => user.username );
                    return res.send( users );
                } )
                .catch( ( err ) => {
                    return res.status( 500 )
                        .send( 'Could not retrieve data! ' + err );
                } );
        },
        addUser( req, res ) {
            const model = {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                stringProfilePicture: 'user.png',
                nationality: req.body.nationality,
                favourites: [],
            };

            if ( !data.users.validator.isValid( model ) ) {
                return Promise.reject( res.status( 400 )
                    .send( 'Data does not meet requirements!' ) );
            }

            return data.users.findUser( model.username )
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
        },
        updateUser( req, res ) {
            return data.users.findById( req.user.id )
                .then( ( user ) => {
                    user.username = req.user.username;
                    user.email = req.body.email || user.email;
                    user.password = req.body.password || user.password;
                    user.nationality = req.body.nationality || user.nationality;
                    if ( req.file ) {
                        user.stringProfilePicture = req.file.filename;
                    }
                    if ( !data.users.validator.isValid( user ) ) {
                        return Promise.reject( 'Data does not meet requirements!' );
                    }
                    return Promise.all( [user, data.users.filter( {
                        email: user.email,
                    } )] );
                } )
                .then( ( [validUser, users] ) => {
                    const index = users
                        .findIndex( ( user ) => user.id.toString() !== validUser.id.toString() );
                    if ( index !== -1 ) {
                        return Promise.reject( 'E-mail already in use!' );
                    }
                    return data.users.updateById( validUser, req.body.password );
                } )
                .then( ( user ) => {
                    return res.status( 200 ).send( 'User successfully updated!' );
                } )
                .catch( ( err ) => {
                    return res.status( 400 ).send( err );
                } );
        },
        getPlaces( req, res ) {
            if ( Object.keys( req.query ).length === 0 ) {
                return data.places.getAll()
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
            const pageSize = req.query.pagesize;
            const pageNumber = req.query.pagenumber;
            return data.places.filter( filter, pageSize, pageNumber )
                .then( ( places ) => {
                    return res.status( 200 ).send( places );
                } )
                .catch( ( err ) => {
                    return res.status( 500 )
                        .send( 'Could not retrieve data! ' + err );
                } );
        },
        getFavourites( req, res ) {
            const filter = {
                userId: req.user.id,
            };
            if ( Object.keys( req.query ).length === 0 ) {
                return data.favourites.getAll( filter )
                    .then( ( favourites ) => {
                        favourites = favourites.map( ( fav ) => fav.placeId );
                        return res.status( 200 ).send( favourites );
                    } )
                    .catch( ( err ) => {
                        return res.status( 500 )
                            .send( 'Could not retrieve data! ' + err );
                    } );
            }

            const pageSize = req.query.pagesize;
            const pageNumber = req.query.pagenumber;
            return data.favourites.filter( filter, pageSize, pageNumber )
                .then( ( favourites ) => {
                    return res.status( 200 ).send( favourites );
                } )
                .catch( ( err ) => {
                    return res.status( 500 )
                        .send( 'Could not retrieve data! ' + err );
                } );
        },
        addFavourite( req, res ) {
            let fav = {};
            return data.places.findById( req.body.placeId )
                .then( ( place ) => {
                    if ( !place ) {
                        return Promise.reject( 'Place not found!' );
                    }
                    fav = {
                        placeId: req.body.placeId,
                        placeTitle: place.title,
                        placeTown: place.town,
                        placePicUrl: place.picUrl,
                        placeDescription: place.description,
                        userId: req.user.id,
                    };
                    return data.favourites.getAll( {
                        userId: fav.userId,
                        placeId: fav.placeId,
                    } );
                } )
                .then( ( favourites ) => {
                    if ( !favourites[0] ) {
                        return data.favourites
                            .create( fav, data.places, data.users );
                    }
                    return Promise.resolve();
                } )
                .then( () => {
                    return res.status( 200 ).send( 'Successfully added!' );
                } )
                .catch( ( err ) => {
                    return res.status( 500 )
                        .send( 'Could not create favourite! ' + err );
                } );
        },
        removeFavourite( req, res ) {
            const filter = {
                userId: req.user.id,
                placeId: req.body.placeId,
            };
            console.log( filter );
            return data.places.findById( req.body.placeId )
                .then( ( place ) => {
                    if ( !place ) {
                        return Promise.reject( 'Place not found!' );
                    }
                    return data.favourites.filter( filter );
                } )
                .then( ( fav ) => {
                    return data.favourites.removeById( fav[0] );
                } )
                .then( () => {
                    return Promise.all( [
                        data.users.findUser( req.user.username ),
                        data.favourites.filter( filter, 1, 5 ),] );
                } )
                .then( ( [user, favourites] ) => {
                    user.favourites = favourites;
                    return data.users.updateById( user );
                } )
                .then( () => {
                    return res.status( 200 ).send( 'Updated successfully!' );
                } )
                .catch( ( err ) => {
                    return res.status( 500 )
                        .send( 'Could not create favourite! ' + err );
                } );
        },
        getComments(req, res) {
            if (!req.user) {
                return res.status(400).send('You need to be logged in!');
            }
            // load more comments logic here
        },
    };

    return controller;
};


module.exports = { init };