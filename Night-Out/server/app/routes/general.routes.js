
const attach = (app) => {
    app.get('/', (req, res) => {
        res.render('general/home.pug');
    });

    app.get('/home', (req, res) => {
        res.render('general/home.pug');
    });

    app.get('/contacts', (req, res) => {
        res.render('general/contacts.pug');
    });

    app.get('/404', (req, res) => {
        res.render('general/error404.pug');
    });

    app.get('/logout', (req, res) => {
        // req.logout();
        res.redirect('/home');
    });

    app.get('/*', (req, res) => {
        res.redirect('/404');
    });

    // JUST FOR TESTING - not an actual route
    app.get('/footer', (req, res) => {
        res.render('/shared/_footer.pug');
    });
};

module.exports = attach;

