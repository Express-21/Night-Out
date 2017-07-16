class BaseData {
    constructor(db, ModelClass, validator) {
        this.db = db;
        this.ModelClass = ModelClass;
        this.collectionName = this._getCollectionName();
        this.collection = this.db.collection(this.collectionName);
    }

    getAll(filter, options) {
        filter = filter || {};
        return this.collection.find(filter, options)
            .toArray();
    }

    create(model) {
        //console.log('<-------->');
        //for (var key in model) {
        //    console.log( key + ': ' + model[key]);
        //}
        return this.collection.insert(model);
    }

    _getCollectionName() {
        return this.ModelClass.name.toLowerCase() + 's';
    }
}

module.exports = BaseData;