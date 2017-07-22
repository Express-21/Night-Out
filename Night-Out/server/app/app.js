const express = require('express');
const app = express();

const init = (data) => {
    require('./config/app.config.js').configApp(app);
    require('../config/passport.config.js')(app, data);

    require('./routes').attachRoutes(app, data);

// temp middleware for debugging
//    app.use((req, res, next) => {
//        console.log('---current user---');
//        console.log(req.user);
//        next();
//    });
    return Promise.resolve(app);
};

module.exports = { init };
