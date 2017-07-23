const attach = (app, data) => {
    app.get('/api/logged', (res,req) => {
        const username = req.user.username || null;
        req.send( username );
    });
}

module.exports = attach;