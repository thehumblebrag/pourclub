var Pub = require('../models/pub');

(new Pub({
    name: 'Mechanics Institute',
    location: {
        latitude: -31.953004,
        longitude: 115.857469
    },
    address: 'REAR 222 William St, Northbridge',
    url: 'http://mechanicsinstitutebar.com.au/'
})).save(function (err) {
    console.log(err);
});

(new Pub({
    name: 'The Village',
    location: {
        latitude: -31.947551,
        longitude: 115.821669
    },
    address: '10-531 Hay Street Subiaco Village Subiaco WA 6008',
    url: 'http://www.thevillagebar.com.au/'
})).save(function (err) {
    console.log(err);
});
