const init = ( mongoIp, port, suffix ) => {
    suffix = suffix || '';
    const connectionString = `mongodb://${mongoIp}/night-out${suffix}`;
    const sessionStoreName = `mongodb://${mongoIp}/sessions${suffix}`;
    const config = {
        port,
        connectionString,
        sessionStoreName,
    };
    return Promise.resolve( config );
};

module.exports = { init };
