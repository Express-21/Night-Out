const webdriver = require( 'selenium-webdriver' );

const setupDriver = ( browser ) => {
    const driver =
        new webdriver.Builder()
            .usingServer( 'http://localhost:4444/wd/hub' )
            .forBrowser( browser )
            .build();
    return driver;
};

module.exports = { setupDriver };
