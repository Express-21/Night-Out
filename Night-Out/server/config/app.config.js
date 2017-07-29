const port = 3001;
const mongoIp = '127.0.0.1';
const connectionString = `mongodb://${mongoIp}/night-out`;
const sessionStoreName = `mongodb://${mongoIp}/sessions`;

module.exports = {
    port,
    connectionString,
    sessionStoreName,
};
