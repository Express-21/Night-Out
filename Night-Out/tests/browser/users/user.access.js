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

    describe( 'user access', () => {
        it( 'expect user to be able to access edit page', () => {
            const validUser = validUsers[0];
            return async()
                .then( () => login( driver, validUser ) )
                .then( () => driver
                    .findElement( By.css( '.dropdown-toggle' ) )
                    .click() )
                .then( () => driver
                    .findElement( By.css( '#nav-btn-user-edit' ) )
                    .click() )
                .then( () => driver.getCurrentUrl() )
                .then( ( url ) => {
                    expect( url ).to.contain( 'users/edit' );
                } );
        } );
        it( 'expect user to be able to access edit page', () => {
            const validUser = validUsers[0];
            return async()
                .then( () => login( driver, validUser ) )
                .then( () => driver
                    .findElement( By.css( '.dropdown-toggle' ) )
                    .click() )
                .then( () => driver
                    .findElement( By.css( '#nav-btn-place-create' ) )
                    .click() )
                .then( () => driver.getCurrentUrl() )
                .then( ( url ) => {
                    expect( url ).to.contain( 'places/create' );
                } );
        } );
        it( 'expect user to be able to access edit page', () => {
            const validUser = validUsers[0];
            return async()
                .then( () => login( driver, validUser ) )
                .then( () => driver
                    .findElement( By.css( '.dropdown-toggle' ) )
                    .click() )
                .then( () => driver
                    .findElement( By.css( '#nav-btn-user-all' ) )
                    .click() )
                .then( () => driver.getCurrentUrl() )
                .then( ( url ) => {
                    expect( url ).to.contain( 'users/all' );
                } );
        } );
    } );
} );
