const init = ( data ) => {
    const controller = {
        getTowns( req, res ) {
            return data.towns.getAll()
                .then( ( towns ) => {
                    towns = towns.map( ( town ) => town.name );
                    return res.send( towns );
                } )
                .catch( ( err ) => {
                    return res.status( 500 ).send( 'Could not retrieve data! ' + err );
                } );
        },
        getNames( req, res ) {
            return data.users.getAll()
                .then( ( users ) => {
                    users = users.map( ( user ) => user.username );
                    return res.send( users );
                } )
                .catch( ( err ) => {
                    return res.status( 500 ).send( 'Could not retrieve data! ' + err );
                } );
        },
    };

    return controller;
};


module.exports = { init };