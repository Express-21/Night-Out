const attach = (app, data) => {
    app.get( '/api/logged', ( req, res ) => {
        const username = req.user.username || null;
        res.send( username );
    });
    app.get( '/api/usernames', ( req, res ) => {
        data.users.getAll()
            .then( ( users ) => users.map( ( user ) => user.username ) )
            .then( ( users ) => {
                return res.send( users );
            } );
    } );
};

module.exports = attach;
