var _ = require('underscore');
var request = require('request');
var url = require('url');
var Pub = require('../models/pub');

// @TODO should be set through some sort of argument, not in the code.
// Someone can hack my keys yo...
var client_id = 'XXX';
var client_secret = 'XXX';
var api_hostname = 'api.foursquare.com';
var _methods = {
    venues: 'v2/venues/explore'
};

var getAPIURL = function (method, options) {
    return url.format({
        protocol: 'https',
        hostname: api_hostname,
        pathname: _methods[method],
        query: _.extend({
            'client_id': client_id,
            'client_secret': client_secret,
            'v': 20130815,
            'section': 'drinks',
            'limit': 50
        }, options)
    });
};

module.exports.nearLocation = function (lat, lng, callback) {
    // Generate 4sq API url
    var api_url = getAPIURL('venues', { ll: [lat, lng].join(',') });
    var places = [];
    // Get 4sq results, create a pub and send it to the user
    request({ url: api_url, json: true }, function (err, resp, body) {
        if (err) {
            return callback(err);
        }
        body.response.groups.forEach(function (group) {
            group.items.forEach(function (item) {
                // Add new record to the database
                places.push(new Pub({
                    name: item.venue.name,
                    location: [item.venue.location.lng, item.venue.location.lat],
                    address: [
                        item.venue.location.address,
                        item.venue.location.city,
                        item.venue.location.state,
                        item.venue.location.postalCode
                    ].join(' '),
                    url: item.venue.url || ''
                }));
            });
            callback(null, places);
        });
    });
};
