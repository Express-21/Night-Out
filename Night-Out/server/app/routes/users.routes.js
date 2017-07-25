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

const attach = (app, data) => {
    app.get('/users/login', (req, res) => {
        res.render('users/login.pug');
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
        res.redirect('/');
    });

    app.get('/users/register', (req, res) => {
        res.render('users/register.pug');
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

        data.users.findUser( model.username )
            .then( ( user ) => {
                if ( user ) {
                    console.log( 'Username already exists!' );
                    return Promise.reject( 'Username already exists!' );
                }
                return data.users.filter( { email: model.email } );
            } )
            .then( ( users ) => {
                console.log( users );
                if ( users.length ) {
                    console.log( 'Email already used!' );
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

    // continue ->
    app.get('/users/all', (req, res) => {
        if (req.user) {
            res.render('users/all.pug');
        } else {
            const message = 'You need to be logged to reach the page!';
            req.flash('error', message);
            res.redirect('/users/login');
        }
    });

    app.get( '/users/edit/:id', ( req, res ) => {
        if (!req.user) {
            return res.redirect('/404');
        }
        if (req.params.id !== req.user._id.toString()) {
            return res.redirect('/users/edit/' + req.user.id);
        }
        return res.render('users/edit.pug', {
            model: req.user,
        });
    });

    app.post('/users/edit/:id', (req, res) => {
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
            data.users.findById( req.user.id )
                .then((user) => {
                    user.stringProfilePicture = req.file.filename;
                    return data.users.updateById( user );
                })
                .then( (user) => {
                    res.render('users/edit.pug', {
                        model: req.user,
                    });
                });
        });
    });

    app.get('/users/:id', (req, res) => {
        // const id = parseInt(req.params.id, 10);
        // const user = users.find((u)=> u.id === id);
        // users will come as an array from teh db
        // if a user is logged in it is attached to the req
        if (!req.user) {
            return res.redirect('/404');
        }
        if (req.params.id !== req.user._id.toString()) {
            return res.redirect('/users/' + req.user.id);
        }
        return res.render('users/profile.pug', {
            model: req.user,
        });
    });
};

module.exports = attach;
