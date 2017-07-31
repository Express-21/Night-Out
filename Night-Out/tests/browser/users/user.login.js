/* eslint-disable no-unused-expressions */
const { expect } = require( 'chai' );
const { setupDriver } = require( '../utils/setup-driver' );
const { login } = require( '../utils/login.user.js' );
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

    describe( 'user log in / log out', () => {
        it( 'expect user to be able to login', () => {
            const validUser = validUsers[0];
            return async()
                .then( () => login( driver, validUser ) )
                .then( () => driver
                    .findElement( By.css( '.greeting' ) )
                    .getText() )
                .then( ( greeting ) => {
                    expect( greeting ).to.equal( `Hi, ${validUser.username}` );
                } );
        } );
        it( 'expect logout to redirect to home', () => {
            const validUser = validUsers[0];
            return async()
                .then( () => login( driver, validUser ) )
                .then( () => driver
                    .findElement( By.css( '.dropdown-toggle' ) )
                    .click() )
                .then( () => driver
                    .findElement( By.css( '#nav-btn-logout' ) )
                    .click() )
                .then( () => driver.getCurrentUrl() )
                .then( ( url ) => {
                    expect( url ).to.equal( appUrl + '/' );
                } );
        } );
    } );
} );
