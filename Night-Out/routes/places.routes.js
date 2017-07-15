const attach = (app) => {

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

    const towns =[
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
        res.render('../server/views/places/all.pug', {
            model: places,
            location: towns,
            type: type,
        });
    });

    app.get('/places/:id', (req, res) => {
        const id = parseInt(req.params.id, 10);
        const place = places.find((p) => p.id === id); // users will come as an array from teh db
        if (!place) {
            return res.redirect('/404');
        }
        return res.render('../server/views/places/details.pug', {
            model: place,
        });
    });
};

module.exports = attach;
