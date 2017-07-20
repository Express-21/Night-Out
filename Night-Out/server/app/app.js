/* globals __dirname */

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const flash = require('express-flash');
const app = express();

const init = (data) => {
    app.set('view engine', 'pug');


    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true }));
    app.use(flash());

    // const data = require('../data');
    require('../config/passport.config.js')(app, data);

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
    const staticPath = path.join(__dirname, '../../public/');
    app.use('/static', express.static(staticPath));

    require('../../routes/general.routes')(app);
    require('../../routes/users.routes')(app, data);
    require('../../routes/places.routes')(app);

    return app;
};

module.exports = { init };
