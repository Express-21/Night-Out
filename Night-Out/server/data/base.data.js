const { ObjectID } = require('mongodb');

class BaseData {
    constructor(db, ModelClass, validator) {
        this.db = db;
        this.ModelClass = ModelClass;
        this.validator = validator;
        this.collectionName = this._getCollectionName();
        this.collection = this.db.collection(this.collectionName);
    }

    getAll(filter, options) {
        filter = filter || {};
        return this.collection.find( filter, options )
            .toArray()
            .then( ( models ) => {
                models = models.map( ( model ) => {
                    return this.ModelClass.toViewModel( model );
                } );
                return models;
            } );
    }

    findById(id) {
        id = new ObjectID(id);
        return this.getAll({
            _id: { $eq: id },
        });
    }

    create(model) {
        //console.log('<-------->');
        //for (var key in model) {
        //    console.log( key + ': ' + model[key]);
        //}
        if (!this._isModelValid(model)) {
            return Promise.reject( 'Invalid model!');
        }
        return this.collection.insert(model)
            .then(()=> {
                return this.ModelClass.toViewModel(model);
            });
    }

    _isModelValid(model) {
        return this.validator.isValid(model);
    }
    _getCollectionName() {
        return this.ModelClass.name.toLowerCase() + 's';
    }
}

module.exports = BaseData;