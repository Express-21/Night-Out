const BaseData = require('./base.data.js');
const Town = require('../models/town.model.js');

class Towns extends BaseData {
    constructor( db ) {
        super(db, Town, Town);
    }

    append(town) {
        const model ={ name: ( town[0].toUpperCase() + town.substr(1) ) };
        this.collection.findOne(model)
            .then((record) => {
                if (record) return record;
                return this.create(model);
            });
    }
}

module.exports = Towns;