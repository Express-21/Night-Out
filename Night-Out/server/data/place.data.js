const BaseData = require('./base.data.js');
const Place = require('../models/place.model.js');

class Places extends BaseData {
    constructor( db ) {
        super(db, Place, Place);
    }

    create(model, towns) {
        towns.append(model.town);
        return super.create(model);
    }

    createEmpty() {
        return super.create( {} );
    }
}

module.exports = Places;
