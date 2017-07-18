class User {
    static isValid(user) {
        return true;
    }

    get id() {
        return this._id;
    }

    static toViewModel(model) {
        const viewModel = new User();
        Object.keys(model)
            .forEach( (key) => {
                viewModel[key] = model[key];
            });
        viewModel.modeled = true;
        return viewModel;
    }
}

module.exports = User;