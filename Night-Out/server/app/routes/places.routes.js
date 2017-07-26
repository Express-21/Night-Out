const multer = require( 'multer' );
const path = require( 'path' );

const storage = multer.diskStorage( {
    destination: ( req, file, cb ) => {
        cb( null, './public/uploads' );
    },
    filename: ( req, file, cb ) => {
        cb( null, '' + req.placeId + path.extname( file.originalname ) );
    },
} );

const getCategoryByUrl = (url) => {
    const urlParts = url.split('/');
    return urlParts[urlParts.length - 1];
};

const limits = {
    fieldNameSize: 100,
    fileSize: 1024 * 1024,
};

const upload = multer( { storage, limits } ).single( 'imageUpload' );
const UNAUTHORIZED_MESSAGE = 'You need to be logged to reach the page!';

const attach = (app, data) => {
    app.get('/places/all', (req, res) => {
        Promise.all( [data.places.getAll(), data.towns.getAll()] )
            .then( ( [places, towns] ) => {
                res.render( 'places/all.pug', {
                    model: places,
                    location: towns,
                    //type: type,
                } );
            } )
            .catch( ( err ) => {
                req.flash( 'error', 'Something went wrong while retrieving data! ' + err );
                res.status( 500 ).render( 'general/general-error.pug' );
            } );
    });

    app.get('/places/category/:category', (req, res) => {
        const category = getCategoryByUrl( req.url );
        data.places.filter( { category } )
            .then( ( placesCategory ) => {
                res.render( 'places/category.pug', {
                    models: placesCategory,
                } );
            } )
            .catch( ( err ) => {
                req.flash( 'error', 'Something went wrong while retrieving data! ' + err );
                res.status( 500 ).render( 'general/general-error.pug' );
            } );
    });

    app.get('/places/create', (req, res) => {
        if ( !req.user ) {
            req.flash( 'error', UNAUTHORIZED_MESSAGE );
            res.status( 403 ).redirect( '/users/login' );
        }
        res.render( 'places/create.pug' );
    });

    app.post('/places/create', (req, res, next) => {
        if ( !req.user ) {
            req.flash( 'error', UNAUTHORIZED_MESSAGE );
            res.status( 403 ).redirect( '/users/login' );
        }
        let emptyPlace = null;
        data.places.createEmpty()
            .then( ( _emptyPlace ) => {
                emptyPlace = _emptyPlace;
                req.placeId = emptyPlace.id;
                upload( req, res, ( err ) => {
                    if ( err ) {
                        let message;
                        switch ( err.code ) {
                            case 'LIMIT_FILE_SIZE':
                            {
                                message = 'File too large! Max size is 1MB.';
                                break;
                            }
                            default:
                            {
                                message = err.code;
                            }
                        }
                        req.flash( 'error', message );
                        return res.redirect( '/places/create/' );
                    }
                    emptyPlace.title = req.body.title;
                    emptyPlace.description = req.body.description;
                    emptyPlace.town = req.body.city;
                    emptyPlace.address = req.body.address;
                    emptyPlace.openingHours = req.body.openHours;
                    emptyPlace.email = req.body.email;
                    emptyPlace.picUrl = req.file.filename;
                    emptyPlace.category = req.body.select;
                    emptyPlace.comments = [];
                    if ( !data.places.validator.isValid( emptyPlace ) ) {
                        data.places.removeById( emptyPlace );
                        req.flash( 'error', 'Data does not meet requirements!' );
                        return res.redirect( '/places/create/' );
                    }
                    return data.places.updateById( emptyPlace )
                        .then( ( place ) => {
                            data.towns.append( place.town );
                            return res.redirect( '/places/' + place.id );
                        } );
                } );
            } )
            .catch( ( err ) => {
                req.flash( 'error', 'Something went wrong while updating data! ' + err );
                res.status( 500 ).render( 'general/general-error.pug' );
            } );
    });

    app.get('/places/:id', (req, res) => {
        const id = req.params.id;
        data.places.findById( id )
            .then( ( place ) => {
                if ( !place ) {
                    return res.redirect( '/404' );
                }
                return res.render( 'places/details.pug', {
                    model: place,
                } );
            } )
            .catch( ( err ) => {
                req.flash( 'error', 'Something went wrong while retrieving data! ' + err );
                res.status( 500 ).render( 'general/general-error.pug' );
            } );
    });

    app.post('/places/:id', (req, res) => {
        if ( !req.user ) {
            req.flash( 'error', UNAUTHORIZED_MESSAGE );
            res.status( 403 ).redirect( '/users/login' );
        }
        const id = req.params.id;
        const model = {
            placeId: id,
            userId: req.user.id,
            username: req.user.username,
            content: req.body.content,
        };
        if ( !data.comments.validator.isValid( model ) ) {
            req.flash( 'error', 'Data does not meet requirements!' );
            return res.redirect( '/places/' + id );
        }
        data.places.findById( model.placeId )
            .then( ( place ) => {
                if ( !place ) {
                    return Promise.reject( 'No such place!' );
                }
                return data.comments.create( model, data.places );
            } )
            .then( ( place ) => {
                return res.redirect( '/places/' + place.id );
            } )
            .catch( ( err ) => {
                req.flash( 'error', 'Something went wrong while retrieving data! ' + err );
                res.status( 500 ).render( 'general/general-error.pug' );
            } );
    });
};

module.exports = attach;
