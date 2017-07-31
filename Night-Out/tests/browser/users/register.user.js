/* eslint-disable no-unused-expressions */
const { expect } = require( 'chai' );
const { setupDriver } = require( '../utils/setup-driver' );
const { By, until } = require( 'selenium-webdriver' );


const async = require( '../../../server/utils/async' );

describe( 'Items routes', () => {
    let driver = null;

    const appUrl = 'http://localhost:3010';

    const validUsers = [{
        username: 'GoshoIvanov',
        password: 'qwert1',
        email: 'gosho@abv.bg',
        nationality: 'bulgarian',
    },
        {
            username: 'IvanGoshov',
            password: 'qwert1',
            email: 'ivan@abv.bg',
            nationality: 'bulgarian',
        }];


    beforeEach( () => {
        driver = setupDriver( 'chrome' );
        return driver.get( appUrl );
    } );

    afterEach( () => {
        return driver.quit();
    } );

    describe( 'Create user', () => {
        it( 'expect to be create user and redirect to user page', () => {
            const validUser = validUsers[0];
            return async()
                .then( () => driver
                    .findElement( By.css( '#nav-btn-register' ) )
                    .click() )
                .then( () => driver
                    .wait( until.urlContains( 'register' ), 1000 ) )
                .then( () => driver
                    .findElement( By.css( 'input[name=username]' ) )
                    .sendKeys( validUser.username ) )
                .then( () => driver
                    .findElement( By.css( 'input[name=email]' ) )
                    .sendKeys( validUser.email ) )
                .then( () => driver
                    .findElement( By.css( 'input[name=password]' ) )
                    .sendKeys( validUser.password ) )
                .then( () => driver
                    .findElement( By.css( '#confirm_password' ) )
                    .sendKeys( validUser.password ) )
                .then( () => driver
                    .findElement( By.css( 'input[name=nationality]' ) )
                    .sendKeys( validUser.nationality ) )
                .then( () => driver
                    .findElement( By.css( '#user-form-btn-register' ) )
                    .click() )
                .then( () => driver
                    .findElement( By.css( '.greeting' ) )
                    .getText() )
                .then( ( greeting ) => {
                    expect( greeting ).to.equal( `Hi, ${validUser.username}` );
                } );
        } );
    } );
} );
