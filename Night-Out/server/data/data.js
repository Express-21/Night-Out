const sessionStoreName = 'mongodb://localhost/sessions';

const User = require('./user.data.js');

const init = (db) => {
    return {
        sessionStoreName,
        users: new User(db),
    };
}

module.exports = { init };