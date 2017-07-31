const passport = require('passport');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/uploads');
    },
    filename: (req, file, cb) => {
        cb(null, '' + req.user.id + path.extname(file.originalname));
    },
});

const limits = {
    fieldNameSize: 100,
    fileSize: 1024 * 1024,
};

const upload = multer( { storage, limits } ).single( 'imageUpload' );
const UNAUTHORIZED_MESSAGE = 'You need to be logged to reach the page!';

const attach = (app, data) => {
    app.get('/users/login', (req, res) => {
        return res.render( 'users/login.pug' );
    });

    app.post('/users/login', (req, res, next) => {
        passport.authenticate( 'local', ( error, user ) => {
            if ( error ) {
                return next( error );
            }
            if ( !user ) {
                req.flash( 'error', 'Incorrect username or password!' );
                return res.status( 401 ).redirect( '/users/login' );
            }
            req.logIn( user, ( err ) => {
                if ( err ) {
                    return next( err );
                }
                return res.redirect( '/users/' + user.id );
            } );
        } )( req, res, next );
    } );

    app.get('/users/logout', (req, res) => {
        req.logout();
        return res.redirect( '/' );
    });

    app.get('/users/register', (req, res) => {
        return res.render( 'users/register.pug' );
    });

    app.post('/users/register', (req, res, next) => {
        // validate
        const model = {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            stringProfilePicture: 'user.png',
            nationality: req.body.nationality,
            favourites: [],
        };

        if ( !data.users.validator.isValid( model ) ) {
            req.flash( 'error', 'Data does not meet requirements!' );
            return res.status( 400 ).redirect( '/users/register' );
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
            .then((user) => {
                req.logIn( user, ( err ) => {
                    if ( err ) {
                        return next( err );
                    }
                    return res.redirect( '/users/' + user.id );
                } );
            } )
            .catch( ( err ) => {
                console.log( err );
                req.flash( 'error', err );
                return res.status( 400 ).redirect( '/users/register' );
            });
    });

    app.get('/users/all', (req, res) => {
        if ( !req.user ) {
            req.flash( 'error', UNAUTHORIZED_MESSAGE );
            return res.status( 403 ).redirect( '/users/login' );
        }

        return data.users.getAll()
            .then( ( users ) => {
                return res.render( 'users/all.pug', {
                    model: users,
                } );
            } )
            .catch( ( err ) => {
                req.flash('error',
                'Something went wrong while retrieving data! ' + err );
                return res.status( 500 ).render( 'general/general-error.pug' );
            });
    });

    app.get( '/users/edit/:id', ( req, res ) => {
        if (!req.user) {
            req.flash( 'error', UNAUTHORIZED_MESSAGE );
            return res.status( 403 ).redirect( '/users/login' );
        }
        if (req.params.id !== req.user._id.toString()) {
            return res.redirect('/users/edit/' + req.user.id);
        }
        return res.render('users/edit.pug', {
            model: req.user,
        });
    });

    app.post('/users/edit/:id', (req, res) => {
        if ( !req.user ) {
            const message = 'You need to be logged to reach the page!';
            req.flash( 'error', message );
            return res.redirect( '/users/login' );
        }
        upload(req, res, (err) => {
            if (err) {
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
                return res.redirect( '/users/edit/' + req.user.id );
            }

            return data.users.findById( req.user.id )
                .then((user) => {
                    user.username = req.user.username;
                    user.email = req.body.email || user.email;
                    user.password = req.body.password || user.password;
                    user.nationality = req.body.nationality || user.nationality;
                    if ( req.file ) {
                        user.stringProfilePicture = req.file.filename;
                    }
                    if ( !data.users.validator.isValid( user ) ) {
                        return Promise
                        .reject('Data does not meet requirements!');
                    }
                    return Promise.all( [user, data.users.filter( {
                        email: user.email,
                    } )] );
                } )
                .then( ( [validUser, users] ) => {
                    const index = users
                        .findIndex((user) =>
                        user.id.toString() !== validUser.id.toString());
                    if ( index !== -1 ) {
                        return Promise.reject( 'E-mail already in use!' );
                    }
                    return data.users
                    .updateById( validUser, req.body.password );
                })
                .then( (user) => {
                    return res.render( 'users/edit.pug', {
                        model: user,
                    });
                } )
                .catch( ( error ) => {
                    req.flash( 'error', error );
                    return res.redirect( '/users/edit/' + req.user.id );
                });
        });
    });

    app.get('/users/:id', (req, res) => {
        const id = req.params.id;
        return data.users.findById( id )
            .then( ( user ) => {
                if ( !user ) {
                    return Promise.reject( 'No such user!' );
                }
                return res.render( 'users/profile.pug', {
                    model: user,
                } );
            } )
            .catch( () => {
                return res.status( 404 ).redirect( '/404' );
            } );
    });
};

module.exports = attach;
