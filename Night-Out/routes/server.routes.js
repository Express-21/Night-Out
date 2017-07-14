
const attach = (app) => {
    app.get('/', (req, res) => {
        res.send('It works');
        // res.render('home');
    });

    app.get('/home', (req, res) => {
        res.render('../server/views/home.pug');
    });

    app.get('/users/login', (req, res) => {
        res.render('../server/views/users/login.pug');
    });

    app.get('/users/register', (req, res) => {
        res.render('../server/views/users/register.pug');
    });

    app.get('/users/all', (req, res) => {
        res.render('users/all');
    });

    app.get('/users/edit/:id', (req, res) => {
        res.render('users/edit');
    });

    app.get('/404', (req, res) => {
        res.redirect('/404');
    });
};

module.exports = attach;
