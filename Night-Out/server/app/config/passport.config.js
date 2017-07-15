const passport = require('passport');
const { Strategy } = require('passport-local');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const configPassport = (app, { User, sessionStoreName }) => {
    passport.use(new Strategy(
        (username, password, done) => {
            return User.findOne(username)
                .then((user) => {
                    if (!user) {
                        return done(null, false,
                            { message: 'Incorrect username.' });
                    }
                    if (!user.validatePassword(password)) {
                        return done(null, false,
                            { message: 'Incorrect password.' });
                    }
                    return done(null, user);
                })
                .catch((err) => {
                    return done(err);
                });
        }
    ));
    app.use(cookieParser());
    app.use(session({
        secret: 'Deus ex machina',
        maxAge: new Date(Date.now() + 60 * 60 * 1000),
        store: new MongoStore(
            {url: sessionStoreName},
            (err) => {
                console.log(err || 'connect-mongodb setup ok');
            })
    }));

    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        return User.findById(id)
            .then((user) => {
                done(null, user);
            })
            .catch(done);
    });
    console.log('passport initialized')
};

module.exports = configPassport;