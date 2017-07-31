/* eslint-disable no-unused-expressions */
const { expect } = require( 'chai' );
const { setupDriver } = require( '../utils/setup-driver' );
const ui = require( '../utils/ui' );

const async = require( '../../../server/utils/async' );

describe( 'Items routes', () => {
    let driver = null;

    const appUrl = 'http://localhost:3010';

    beforeEach( () => {
        driver = setupDriver( 'chrome' );
        ui.setDriver( driver );
        return driver.get( appUrl );
    } );

    afterEach( () => {
        return driver.quit();
    } );

    describe( 'Valid home page', () => {
        it( 'expect to be visible', ( done ) => {
            async()
                .then( () => driver.getTitle() )
                .then( ( title ) => {
                    expect( title ).to.equal( 'NightOut' );
                    done();
                } )
                .catch( ()=> {
                    done();
                } );
        } );
    } );
} );
