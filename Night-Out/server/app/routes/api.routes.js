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
    app.get( '/api/towns', ( req, res ) => {
        data.towns.getAll()
            .then( ( towns ) => towns.map( ( town ) => town.name ) )
            .then( ( towns ) => {
                return res.send( towns );
            } );
    } );
    app.get( '/api/places/names', ( req, res ) => {
        data.places.getAll()
            .then( ( places ) => places.map( ( place ) => place.title ) )
            .then( ( places ) => res.send( places ) );
    } );
};

module.exports = attach;
