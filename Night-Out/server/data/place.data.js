const BaseData = require('./base.data.js');
const Place = require('../models/place.model.js');

class Places extends BaseData {
    constructor( db ) {
        super(db, Place, Place);
    }
}

module.exports = Places;