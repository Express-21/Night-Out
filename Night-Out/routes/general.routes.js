
const attach = (app) => {
    app.get('/', (req, res) => {
        res.render('../server/views/general/home.pug');
    });

    app.get('/home', (req, res) => {
        res.render('../server/views/general/home.pug');
    });

    app.get('/contacts', (req, res) => {
        res.render('../server/views/general/contacts.pug');
    });

    app.get('/404', (req, res) => {
        res.render('../server/views/general/error404.pug');
    });

    app.get('/logout', (req, res) => {
        //req.logout();
        res.redirect('/home');
    });

    // JUST FOR TESTING - not an actual route
    app.get('/footer', (req, res) => {
        res.render('../server/views/shared/_footer.pug');
    });
};

module.exports = attach;

