const sessionStoreName = 'mongodb://localhost/sessions';

const Users = require('./user.data.js');

const init = (db) => {
    return {
        sessionStoreName,
        users: new Users(db),
    };
}

module.exports = { init };