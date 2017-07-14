const attach = (app) => {
    app.get('/users/login', (req, res) => {
        res.render('../server/views/users/login.pug');
    });

    app.post('users/login', (req, res) => {
        // data.users.getByObjectName(req.body.username)
        // .then((user) => {
        //         res.redirect('/users/' + user._id);
        //     });
    });

    app.get('/users/register', (req, res) => {
        res.render('../server/views/users/register.pug');
    });

    app.post('users/register', (req, res) => {
        // validate
        const user = {
            name: req.body.username,            // all the properties will be prop to the user model in the db
            email: req.body.email,
            password: req.body.password,
            stringProfilePicture: 'user.png',
        };
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
        const id = parseInt(req.params.id, 10);
        const user = users.find((u)=> u.id === id); // users will come as an array from teh db
        if (!user) {
            return res.redirect('/404');
        }
        return res.render('../server/views/users/profile.pug', {
            model: user,
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
