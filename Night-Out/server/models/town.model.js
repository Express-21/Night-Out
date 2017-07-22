class Town {
    static isValid(model) {
        return true;
    }

    get id() {
        return this._id;
    }

    static toViewModel(model) {
        const viewModel = new Town();
        Object.keys(model)
            .forEach( (key) => {
                viewModel[key] = model[key];
            });

        return viewModel;
    }
}

module.exports = Town;
