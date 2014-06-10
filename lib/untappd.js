var request = require('request');

var CLIENT_ID = "1056DE4078534A4840B0F6AA7EBE5C2E067B6C41";
var CLIENT_SECRET = "34DF16638D3882E65BCBAC09186BC3E1123EB78E";
var API_URL = "http://api.untappd.com/v4";
var PARAMS = "?client_id=" + CLIENT_ID + "&client_secret=" + CLIENT_SECRET;

module.exports.findBeersAtFoursquareLocation = function (foursquare_id, callback) {
    idByFoursquareId(foursquare_id, function (err, untappd_id) {
        venueById(untappd_id, function (err, venue) {
            if (err) return callback(err);
            if (!venue) return callback(null, null);
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
    });
};

venueById = module.exports.venueById = function (untappd_id, callback) {
    var url = API_URL + "/venue/info/" + untappd_id + PARAMS;
    request({ url: url, json: true }, function (err, resp, body) {
        if (err) return callback(err);
        callback(null, body.response.venue);
    });
};

idByFoursquareId = module.exports.idByFoursquareId = function (foursquare_id, callback) {
    var url = API_URL + "/venue/foursquare_lookup/" + foursquare_id + PARAMS;
    request({ url: url, json: true }, function (err, resp, body) {
        if (err) return callback(err);
        var untappd_id;
        if (body.response.venue && body.response.venue.items)
            untappd_id = body.response.venue.items.pop().venue_id;
        callback(null, untappd_id);
    });
};
