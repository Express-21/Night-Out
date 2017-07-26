const DEFAULT_PAGE_SIZE = 10;

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
        return this.collection.findOne({
            _id: { $eq: id },
        })
            .then( (model) => {
                if ( !model ) return model;
                return this.ModelClass.toViewModel(model);
            });
    }

    filter(filter, pageSize, pageNumber) {
        filter = filter || {};
        pageSize = pageSize || DEFAULT_PAGE_SIZE;
        pageNumber = pageNumber || 1;

        return this.collection.find( filter )
            .skip( (pageNumber - 1) * pageSize )
            .limit( pageSize )
            .toArray()
            .then( (models) => {
                models = models.map( ( model ) => {
                    return this.ModelClass.toViewModel( model );
                } );
                return models;
            });
    }

    updateById( model ) {
        if ( !this._isModelValid( model ) ) {
            return Promise.reject( 'Invalid model!' );
        }
        return this.collection
            .updateOne( { _id: new ObjectID(model.id) }, model )
            .then(() => {
                return this.ModelClass.toViewModel(model);
            });
    }

    removeById( model ) {
        return this.collection.deleteOne( { _id: new ObjectID( model.id ) } );
    }

    create(model) {
        if (!this._isModelValid(model)) {
            return Promise.reject( 'Invalid model!');
        }
        return this.collection.insert(model)
            .then((result)=> {
                return this.ModelClass.toViewModel(result.ops[0]);
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