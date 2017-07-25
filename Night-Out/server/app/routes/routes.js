/* globals __dirname */

const fs = require('fs');
const path = require('path');

const attachRoutes = (app, data) => {
        app.get('*', function(req, res, next) {
            res.locals.isLogged = !!(req.user);
            next();
        });

    fs.readdirSync(__dirname)
        .filter((file) => file.includes('.routes.js'))
        .map((file)=>path.join(__dirname, file))
        .forEach((modulePath) => {
            require(modulePath)(app, data);
        });
};

module.exports = { attachRoutes };
