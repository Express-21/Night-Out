const Users = require('./user.data.js');
const Places = require('./place.data.js');
const Favourites = require('./favourite.data.js');
const Comments = require('./comment.data.js');
const Towns = require('./town.data.js');

const init = (db) => {
    return {
        users: new Users(db),
        places: new Places(db),
        favourites: new Favourites(db),
        comments: new Comments(db),
        towns: new Towns(db),
    };
};

module.exports = { init };
