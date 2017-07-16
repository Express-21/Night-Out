const users = [
    {
        username: '2NSoft',
        password: '2NSoft',
        id: '1234567890',
    }];

const BaseData = require('./base.data.js');

class User extends BaseData {
    constructor( db ) {// , { username, password, email, stringProfilePicture, id }) {
        super(db, User);
        // this.username = username;
        // this.password = password;
        // this.email = email;
        // this.stringProfilePicture = stringProfilePicture;
        // this.id = id;
    }

    findOne(username) {
        return this.getAll({
            username: { $eq: username },
        });
        //return new Promise( (resolve, reject ) => {
        //    const user = users.find( (u) => {
        //        return u.username === username;
        //    });
        //    if (!user) {
        //        reject();
        //    }
        //    resolve(new User(/* this.db, */user));
        //});
    }
    findById(id) {
        //console.log(id);
        id = require('mongodb').ObjectID(id);
        return this.getAll({
            _id: { $eq: id },
        });
        //return new Promise((resolve, reject) => {
        //    const user = users.find( (u) => {
        //        return u.id === id;
        //    });
        //    if (!user) {
        //        reject();
        //    }
        //    resolve(new User(/* this.db, */user));
        //});
    }

    validatePassword(password) {
        return true;//this.password === password;
    }
}

module.exports = User;