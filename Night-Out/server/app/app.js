const express = require('express');
const app = express();

const init = (data) => {
    require('./config/app.config').applyTo(app);
    require('../config/passport.config.js')(app, data);
    require('../app/routes/general.routes')(app);
    require('../app/routes/users.routes')(app, data);
    require('../app/routes/places.routes')(app, data);

// temp middleware for debugging
//    app.use((req, res, next) => {
//        console.log('---current user---');
//        console.log(req.user);
//        next();
//    });
    return Promise.resolve(app);
};

module.exports = { init };
