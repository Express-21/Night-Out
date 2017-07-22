const BaseData = require('./base.data.js');
const Town = require('../models/town.model.js');

class Towns extends BaseData {
    constructor( db ) {
        super(db, Town, Town);
    }
}

module.exports = Towns;