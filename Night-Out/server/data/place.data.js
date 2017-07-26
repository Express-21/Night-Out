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
        return this.collection.insert( {} )
            .then( ( result )=> {
                return this.ModelClass.toViewModel( result.ops[0] );
            } );
    }
}

module.exports = Places;
