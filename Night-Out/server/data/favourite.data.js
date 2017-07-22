const BaseData = require('./base.data.js');
const Favourite = require('../models/favourite.model.js');

class Favourites extends BaseData {
    constructor( db ) {
        super(db, Favourite, Favourite);
    }
}

module.exports = Favourites;