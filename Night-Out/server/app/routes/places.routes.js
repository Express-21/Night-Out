const attach = (app, data) => {
    // ONLY FOR TEST!
    const places = [
        {
            'id': 1,
            'name': 'name',
            'type': 'bar',
            'address': 'some address',
        },
        {
            'id': 2,
            'name': 'other name',
            'type': 'restaurant',
            'address': 'some other address',
        },
    ];

    const towns = [
        {
            'id': 1,
            'name': 'London',
        },
        {
            'id': 2,
            'name': 'Paris',
        },
        {
            'id': 3,
            'name': 'Rome',
        },
        {
            'id': 4,
            'name': 'Budapest',
        },
        {
            'id': 5,
            'name': 'Vienna',
        },
        {
            'id': 6,
            'name': 'Prague',
        },
    ];

    //
    app.get('/places/all', (req, res) => {
        // const type = req.params.type;
        const type = 'bar';
        res.render('places/all.pug', {
            model: places,
            location: towns,
            type: type,
        });
    });

    app.get('/places/create', (req, res) => {
        // const type = req.params.type;
        res.render('places/create.pug');
    });

    app.post('/places/create', (req, res, next) => {
        // validate
        const model = {
            title: req.body.title,
            description: req.body.description,
            address: req.body.address,
            openingHours: req.body.openingHours,
            email: req.body.email,
            comments: [],
        };

        data.places.create(model)
        .then( (place) => {
                console.log(place.id);
                return res.redirect('/places/' + place.id);
            });
    });

    app.get('/places/:id', (req, res) => {
        // const id = parseInt(req.params.id, 10);
        // const place = places.find((p) => p.id === id);
        const id = req.params.id;
        data.places.findById( id )
        .then( (place) => {
                if ( !place ) {
                    return res.redirect( '/404' );
                }
                console.log(place.comments);
                return res.render( 'places/details.pug', {
                    model: place,
                } );
            });
    });

    app.post('/places/:id', (req, res) => {
        // const id = parseInt(req.params.id, 10);
        // const place = places.find((p) => p.id === id);
        const id = req.params.id;
        const model = {
            placeId: id,
            userId: req.user.id,
            username: req.user.username,
            content: req.body.content,
        };
        data.comments.create( model, data.places )
            .then( (place) => {
                console.log(place);
                console.log(' redirecting /places/' + place.id);
                return res.redirect('/places/' + place.id );
            });
    });
};

module.exports = attach;
