const BaseData = require('./base.data.js');
const crypto = require('crypto');
const User = require('../models/user.model.js');

const hashPassword = (password) => {
    return crypto.createHmac('sha256', 'Deus ex machina')
        .update(password)
        .digest('hex');
};

class Users extends BaseData {
    constructor( db ) {
        super(db, User, User);
    }

    create(model) {
        model.password = hashPassword(model.password);
        return super.create(model);
    }

    findUser(username) {
        return this.collection.findOne({
            username: { $eq: username },
        })
            .then((user) => {
                return this.ModelClass.toViewModel(user);
            } );
    }

    updateUser() {

    }

    validatePassword(username, password) {
        return this.collection.findOne({
            username,
        })
        .then((user)=>{
            if (!user) {
                throw new Error('Invalid user!');
            }
            if ((user.password) !== hashPassword(password)){
                 throw new Error('Invalid password!');
            }
            return true;
        });
    }
}
module.exports = Users;
