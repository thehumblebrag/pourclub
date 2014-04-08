var Pub = require('../models/pub')
  , request = require('request')
  , url = require('url');

// Generate 4sq API url
var api_url = url.format({
    protocol: 'https',
    hostname: 'api.foursquare.com',
    pathname: 'v2/venues/explore',
    query: {
        'client_id': 'FXNW4UTGKF5TKUN3TMAGSRUS2V4XZYXAV2PSXGT4MCEV1AH5',
        'client_secret': '035ZZHW1I5YGDCEYWIUYCYXIJR5EZ4WQZVSFX2CVAHQGES32',
        'v': 20130815,
        'll': '-31.9460,115.8540',
        'section': 'drinks',
        'limit': 50
    }
});

// Get 4sq results and add them to the database, without error or dupe checking
request({ url: api_url, json: true }, function (err, resp, body) {
    body.response.groups.forEach(function (group) {
        group.items.forEach(function (item) {
            // Add new record to the database
            (new Pub({
                name: item.venue.name,
                location: {
                    latitude: item.venue.location.lat,
                    longitude: item.venue.location.lng
                },
                address: [
                    item.venue.location.address,
                    item.venue.location.city,
                    item.venue.location.state,
                    item.venue.location.postalCode
                ].join(' '),
                url: item.venue.url || ''
            })).save(function (err) {
                console.log(err);
            });
        });
    })
});
