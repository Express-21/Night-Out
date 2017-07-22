const passport = require('passport');

const attach = (app, data) => {
    app.get('/users/login', (req, res) => {
        res.render('users/login.pug');
    });

    app.post('/users/login', (req, res, next) => {
            passport.authenticate('local', (error, user) => {
                if (error) {
                    return next(error);
                }
                if (!user) {
                    req.flash('error', 'Incorrect username or password!');
                    return res.redirect('/users/login');
                }
                req.logIn(user, (err) => {
                    if (err) {
                        return next(err);
                    }
                    return res.redirect('/users/' + user.id);
                });
            })(req, res, next);
        });
    // temp for testing
    app.get('/users/logout', (req, res) => {
        req.logout();
        res.redirect('/');
    });

    app.post('/users/logout', (req, res) => {
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
            favourites: [],
        };

        data.users.create( model )
            .then((user) => {
            req.logIn( user, (err) => {
                if (err) {
                    return next(err);
                }
                return res.redirect('/users/' + user.id);
            });
        });
    });

    // ONLY FOR TEST!
    // const users = [
    //    {
    //        'id': 1,
    //        'username': 'misha',
    //        'email': 'some@mail.com',
    //    },
    // ];
//
    app.get('/users/all', (req, res) => {
        data.users.getAll()
            .then((users) => {
                res.render( 'users/all.pug', {
                    model: users,
                } );
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

    app.get('/users/edit/:id', (req, res) => {
        res.render('users/edit');
    });

    app.post('/users/edit/:id', (req, res) => {
        // res.render('users/edit');
        res.send('OK');
    });
};

module.exports = attach;
