/**
 * Routes: Pub
 *
 * CRUD based routes to handle user interaction of
 * pourclub pub listings.
 */

var async = require('async');
var Pub = require('../models/pub');
var foursquare = require('../lib/foursquare');

var LIMIT = 10;
var SEARCH_RADIUS = 1500;

// CRUD routes

module.exports.param = function (req, res, next, pub_id) {
    Pub.findById(pub_id)
        .populate('boozes')
        .exec(function (err, pub) {
            if (err) {
                return console.error(err);
            }
            req.node = pub;
            next();
        });
};

module.exports.list = function (req, res, next) {
    if (req.query.ll) {
        return listByLocation(req, res);
    }
    Pub.find().populate('boozes').limit(LIMIT).exec(function (err, pubs) {
        if (err) {
            return console.error(err);
        }
        res.json(pubs);
    });
};

module.exports.get = function (req, res, next) {
    res.json(req.node);
};

module.exports.save = function (req, res) {
    res.json({ err: false });
};

module.exports.delete = function (req, res, next) {
    req.node.remove();
};

module.exports.update = function (req, res, next) {
    // Convert JS/JSON object to an array of IDs and remove duplicates
    req.body.boozes = req.body.boozes
        .map(function (booze) {
            return booze._id;
        }).filter(function (booze, pos, self) {
            return self.indexOf(booze) === pos;
        });
    Pub.findByIdAndUpdate(req.node._id, _sanatizeForUpdate(req.body))
        .populate('boozes')
        .exec(function (err, data) {
            if (err) {
                console.error(err, data);
                res.json({ err: err });
            }
            res.json(data);
    });
};

// Helper methods

var _sanatizeForUpdate = function (doc) {
    delete doc._id;
    delete doc.id;
    delete doc.__v;
    return doc;
};

var listByLocation = function (req, res) {
    var ll = req.query.ll.split(',').map(Number);
    var radius = req.query.r || SEARCH_RADIUS;
    var point = {
        type: 'Point',
        coordinates: ll.reverse()
    };
    var options = {
        spherical: true,
        maxDistance: radius / 6378137,
        distanceMultiplier: 6378137
    };
    Pub.geoNear(point, options, function (err, terms) {
        async.map(terms,
            function (term, next) {
                term.obj.populate('boozes', function (err, pub) {
                    next(null, pub);
                });
            }, function (err, pubs) {
                if (!pubs.length) {
                    return listByLocationFoursquare(req, res);
                }
                res.json(pubs);
            });
    });
};

var listByLocationFoursquare = function (req, res) {
    var ll = req.query.ll.split(',').map(Number);
    foursquare.nearLocation(ll[0], ll[1], function (err, places) {
        async.each(places, function (pub, next) {
            pub.save(function (err, result) {
                if (err && err.code == 11000) {
                    return next();
                }
                else if (err) {
                    return next(err);
                }
                next();
            });
        }, function (err) {
            if (err) {
                console.error(err);
            }
            res.json(places);
        });
    });
};
