var _ = require('underscore');
var async = require('async');
var request = require('request');
var url = require('url');
var util = require('util');
var Pub = require('../models/pub');

// Script configuration
var config = require('../config');
var client_id = config.foursquare.client_id;
var client_secret = config.foursquare.client_secret;
var api_hostname = 'api.foursquare.com';

var getAPIURL = function (method, options) {
    return url.format({
        protocol: 'https',
        hostname: api_hostname,
        pathname: method,
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
    var api_url = getAPIURL('v2/venues/explore', { ll: [lat, lng].join(',') });
    var places = [];
    // Get Foursquare results, create a pub and send it to the user
    request({ url: api_url, json: true }, function (err, resp, body) {
        if (err) {
            return callback(err);
        }
        if (!body.response.groups) {
            return callback(null, []);
        }
        body.response.groups.forEach(function (group) {
            async.map(group.items, function (item, next) {
                // Add new record to the database
                return photos(item.venue.id, function (err, photo) {
                    next(err, new Pub({
                        name: item.venue.name,
                        location: [item.venue.location.lng, item.venue.location.lat],
                        address: [
                            item.venue.location.address,
                            item.venue.location.city,
                            item.venue.location.state,
                            item.venue.location.postalCode
                        ].join(' '),
                        url: item.venue.url || '',
                        foursquare_id: item.venue.id,
                        image: photo
                    }));
                });
            }, callback);
        });
    });
};

photos = module.exports.photos = function (foursquare_id, count, callback) {
    if (typeof count === 'function') {
        callback = count;
        count = undefined;
    }
    count = count || 1;
    var api_url = getAPIURL(util.format('/v2/venues/%s/photos', foursquare_id));
    return request({ url: api_url, json: true }, function (err, resp, body) {
        if (err) {
            return callback(err);
        }
        if (body.response && body.response.photos && body.response.photos.items.length) {
            var photo_url = [
                body.response.photos.items[0].prefix,
                'original',
                body.response.photos.items[0].suffix
            ].join('');
            return callback(null, photo_url);
        }
        callback(null, null);
    });
};
