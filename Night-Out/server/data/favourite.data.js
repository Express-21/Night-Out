const BaseData = require('./base.data.js');
const Favourite = require('../models/favourite.model.js');

class Favourites extends BaseData {
    constructor( db ) {
        super(db, Favourite, Favourite);
    }
    
    create(model, places, users) {
        return super.create(model)
            .then( (fav) => {
                return users.findById( fav.userId );
            })
            .then( ( user ) => {
                if (!user.favourites) {
                    user.favourites = [];
                }
                while (user.favourites >= 5) {
                    user.favourites.pop();
                }
                user.favourites.unshift(model);
                return users.updateById(user);
            } );
    }
}

module.exports = Favourites;