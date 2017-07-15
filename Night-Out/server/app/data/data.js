const sessionStoreName = 'mongodb://localhost/sessions';
const users = [
    {
        username: '2NSoft',
        password: '2NSoft',
        id: '1234567890',
    }];

class User {
    constructor({ username, password, email, stringProfilePicture, id }) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.stringProfilePicture = stringProfilePicture;
        this.id = id;
    }

    static findOne(username) {
        return new Promise( (resolve, reject ) => {
            const user = users.find( (u) => {
                return u.username === username;
            });
            if (!user) {
                reject();
            }
            resolve(new User(user));
        });
    }
    static findById(id) {
        return new Promise((resolve, reject) => {
            const user = users.find( (u) => {
                return u.id === id;
            });
            if (!user) {
                reject();
            }
            resolve(new User(user));
        });
    }

    validatePassword(password) {
        return this.password === password;
    }
}

module.exports = {
    User,
    sessionStoreName,
};