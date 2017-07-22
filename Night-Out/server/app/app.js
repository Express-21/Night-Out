/* globals __dirname */

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const flash = require('express-flash');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const app = express();

const init = (data) => {
    app.set('view engine', 'pug');
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(flash());

    // const data = require('../data');
    require('../config/passport.config.js')(app, data);
    require('../app/routes/general.routes')(app);
    require('../app/routes/users.routes')(app, data);
    require('../app/routes/places.routes')(app);

    const staticPath = path.join(__dirname, '../../public/');
    app.use('/static', express.static(staticPath));

// temp middleware for debugging
//    app.use((req, res, next) => {
//        console.log('---current user---');
//        console.log(req.user);
//        next();
//    });

    app.use('libs',
        express.static(
            path.join(__dirname, '../../node_modules/'))
    );

    app.use(cookieParser('keyboard cat'));

    app.use(session({
        saveUninitialized: true,
        resave: false,
        secret: 'secret',
        maxAge: 60000,
    }));

    app.get('/*', (req, res) => {
        res.redirect('/404');
    });

    return Promise.resolve(app);
};

module.exports = { init };
