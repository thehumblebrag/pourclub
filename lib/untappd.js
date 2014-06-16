var request = require('request');
var config = require('../config');

var CLIENT_ID = config.untappd.client_id;
var CLIENT_SECRET = config.foursquare.client_secret;
var API_URL = "http://api.untappd.com/v4";
var PARAMS = "?client_id=" + CLIENT_ID + "&client_secret=" + CLIENT_SECRET;

findBeersAtLocation = module.exports.findBeersAtLocation = function (pub, callback) {
    if (!pub.untappd_id) {
        return idByFoursquareId(pub.foursquare_id, function (err, untappd_id) {
            if (err) {
                console.error(err);
                return callback(err);
            }
            if (!untappd_id) {
                console.warn('No untappd ID, skipping');
                return callback(null, []);
            }
            pub.untappd_id = untappd_id;
            pub.save(function (err, pub) {
                findBeersAtLocation(pub, callback);
            });
        });
    }
    else {
        venueById(pub.untappd_id, function (err, venue) {
            if (err) {
                return callback(err);
            }
            if (!venue) {
                return callback(null, null);
            }
            beers = venue.top_beers.items.map(function (obj) {
                var beer = obj.beer;
                beer.brewery = {
                    name: obj.brewery.brewery_name,
                    label: obj.brewery.brewery_label
                };
                return beer;
            });
            callback(null, beers);
        });
    }
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
