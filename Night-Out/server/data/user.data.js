const BaseData = require('./base.data.js');
const crypto = require('crypto');
const { ObjectID } = require('mongodb');

const hashPassword = (password) => {
    return crypto.createHmac('sha256', 'Deus ex machina')
        .update(password)
        .digest('hex');
};

class User extends BaseData {
    constructor( db ) {
        super(db, User);
    }

    create(model) {
        model.password = hashPassword(model.password);
        return super.create(model);
    }

    findOne(username) {
        return this.getAll({
            username: { $eq: username },
        });
    }
    findById(id) {
        id = new ObjectID(id);
        return this.getAll({
            _id: { $eq: id },
        });
    }

    validatePassword(user, password) {
        return hashPassword(password) === user.password;
    }
}

module.exports = User;