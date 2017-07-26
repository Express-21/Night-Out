const Validator = require( '../utils/validator' );

class Place {
    static isValid(model) {
        if ( !Validator.validatePlace( model ) ) {
            return false;
        }
        return true;
    }

    get id() {
        return this._id;
    }

    static toViewModel(model) {
        const viewModel = new Place();
        Object.keys(model)
            .forEach( (key) => {
                viewModel[key] = model[key];
            });

        return viewModel;
    }
}

module.exports = Place;