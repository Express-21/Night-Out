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

const attach = (app, data) => {
    // ONLY FOR TEST!
    const places = [
        {
            'id': 1,
            'name': 'name',
            'type': 'bar',
            'address': 'some address',
        },
        {
            'id': 2,
            'name': 'other name',
            'type': 'restaurant',
            'address': 'some other address',
        },
    ];

    const towns = [
        {
            'id': 1,
            'name': 'London',
        },
        {
            'id': 2,
            'name': 'Paris',
        },
        {
            'id': 3,
            'name': 'Rome',
        },
        {
            'id': 4,
            'name': 'Budapest',
        },
        {
            'id': 5,
            'name': 'Vienna',
        },
        {
            'id': 6,
            'name': 'Prague',
        },
    ];

    //
    app.get('/places/all', (req, res) => {
        // const type = req.params.type;
        const type = 'bar';
        res.render('places/all.pug', {
            model: places,
            location: towns,
            type: type,
        });
    });

    app.get('/places/category/:category', (req, res) => {
        const category = getCategoryByUrl(req.url);
        const placesCategory = data.places.filter({ category });

        res.render('places/category.pug', {
            models: placesCategory,
        });
    });

    app.get('/places/create', (req, res) => {
        // const type = req.params.type;
        res.render('places/create.pug');
    });

    app.post('/places/create', (req, res, next) => {
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
                    emptyPlace.town = req.body.town;
                    emptyPlace.address = req.body.address;
                    emptyPlace.openingHours = req.body.openingHours;
                    emptyPlace.email = req.body.email;
                    emptyPlace.picUrl = req.file.filename;
                    emptyPlace.comments = [];
                    return data.places.updateById( emptyPlace )
                        .then( ( place ) => {
                            return res.redirect( '/places/' + place.id );
                        } );
                } );
            } );
        //console.log( model );
        //data.places.create( model, data.towns )
        //    .then( ( place ) => {
        //        console.log( place.id );
        //        return res.redirect( '/places/' + place.id );
        //    } );
        // validate

        //data.users.findById( req.user.id )
        //    .then((user) => {
        //        user.stringProfilePicture = req.file.filename;
        //        return data.users.updateById( user );
        //    })
        //    .then( (user) => {
        //        res.render('users/edit.pug', {
        //            model: req.user,
        //        });
        //    });
        //});
    });

    app.get('/places/:id', (req, res) => {
        // const id = parseInt(req.params.id, 10);
        // const place = places.find((p) => p.id === id);
        const id = req.params.id;
        data.places.findById( id )
        .then( (place) => {
                if ( !place ) {
                    return res.redirect( '/404' );
                }
                console.log(place.comments);
                return res.render( 'places/details.pug', {
                    model: place,
                } );
            });
    });

    app.post('/places/:id', (req, res) => {
        // const id = parseInt(req.params.id, 10);
        // const place = places.find((p) => p.id === id);
        const id = req.params.id;
        const model = {
            placeId: id,
            userId: req.user.id,
            username: req.user.username,
            content: req.body.content,
        };
        data.comments.create( model, data.places )
            .then( (place) => {
                console.log(place);
                console.log(' redirecting /places/' + place.id);
                return res.redirect('/places/' + place.id );
            });
    });
};

module.exports = attach;
