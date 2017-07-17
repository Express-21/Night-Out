const passport = require('passport');

const attach = (app, data) => {
    app.get('/users/login', (req, res) => {
        res.render('../server/views/users/login.pug');
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
                    return res.redirect('/users/' + user._id);
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
        res.render('../server/views/users/register.pug');
    });

    app.post('/users/register', (req, res, next) => {
        // validate
        const user = {
            username: req.body.username,            // all the properties will be prop to the user model in the db
            email: req.body.email,
            password: req.body.password,
            stringProfilePicture: 'user.png',
        };
        data.users.create( user ).then(() => {
            req.logIn( user, (err) => {
                if (err) {
                    return next(err);
                }
                return res.redirect('/users/' + user._id);
            });
        });
    });

    // ONLY FOR TEST!
    const users = [
        {
            'id': 1,
            'username': 'misha',
            'email': 'some@mail.com',
        },
    ];
//
    app.get('/users/all', (req, res) => {
        res.render('../server/views/users/all.pug', {
            model: users,
        });
    });

    app.get('/users/:id', (req, res) => {
        //const id = parseInt(req.params.id, 10);
        //const user = users.find((u)=> u.id === id); // users will come as an array from teh db

        //if a user is logged in it is attached to the req
        if (!req.user) {
            return res.redirect('/404');
        }
        if (req.params.id !== req.user._id.toString()) {
            return res.redirect('/users/' + req.user._id);
        }
        return res.render('../server/views/users/profile.pug', {
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
