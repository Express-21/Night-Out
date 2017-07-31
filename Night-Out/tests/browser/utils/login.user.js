const { By, until } = require( 'selenium-webdriver' );

const async = require( '../../../server/utils/async' );


const login = ( driver, user ) => {
    return async()
        .then( () => driver
            .findElement( By.css( '#nav-btn-login' ) )
            .click() )
        .then( () => driver
            .wait( until.urlContains( 'login' ), 1000 ) )
        .then( () => driver
            .findElement( By.css( 'input[name=username]' ) )
            .sendKeys( user.username ) )
        .then( () => driver
            .findElement( By.css( 'input[name=password]' ) )
            .sendKeys( user.password ) )
        .then( () => driver
            .findElement( By.css( '#user-form-btn-login' ) )
            .submit() );
};

module.exports = { login };