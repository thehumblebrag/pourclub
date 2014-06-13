var config = require('../config');
var request = require('request');

var CLIENT_ID = config.untappd.client_id;
var CLIENT_SECRET = config.foursquare.client_secret;
var API_URL = "http://api.untappd.com/v4";
var PARAMS = "?client_id=" + CLIENT_ID + "&client_secret=" + CLIENT_SECRET;

module.exports.findBeersAtFoursquareLocation = function (foursquare_id, callback) {
    idByFoursquareId(foursquare_id, function (err, untappd_id) {
        if (!untappd_id) {
            console.error(new Error('Venue does not exist in Untappd'));
            return callback(null, []);
        }
        venueById(untappd_id, function (err, venue) {
            if (err) {
                return callback(err);
            }
            if (!venue) {
                return callback();
            }
            console.log(venue, venue.top_beers);
            beers = venue.top_beers.items.map(function (obj) {
                var beer = obj.beer;
                beer.brewery = {
                    name: obj.brewery.brewery_name,
                    label: obj.brewery.brewery_label
                };
                console.log(beer);
                return beer;
            });
            callback(null, beers);
        });
    });
};

venueById = module.exports.venueById = function (untappd_id, callback) {
    var url = API_URL + "/venue/info/" + untappd_id + PARAMS;
    request({ url: url, json: true }, function (err, resp, body) {
        if (err) {
            return callback(err);
        }
        callback(null, body.response.venue);
    });
};

idByFoursquareId = module.exports.idByFoursquareId = function (foursquare_id, callback) {
    var url = API_URL + "/venue/foursquare_lookup/" + foursquare_id + PARAMS;
    request({ url: url, json: true }, function (err, resp, body) {
        if (err) {
            return callback(err);
        }
        var untappd_id;
        if (body.response.venue && body.response.venue.items) {
            untappd_id = body.response.venue.items.pop().venue_id;
        }
        callback(null, untappd_id);
    });
};
