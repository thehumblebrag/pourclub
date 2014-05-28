/**
 * Routes: Pub
 *
 * CRUD based routes to handle user interaction of
 * TapThat pub listings.
 */

var async = require('async');
var Pub = require('../models/pub');

var LIMIT = 10;
var SEARCH_RADIUS = 1000;

// Crud routes

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
        return module.exports.listByLocation(req, res);
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
    // Mongo only supports list of IDs so clear the cruft
    req.body.boozes = req.body.boozes.map(function (booze) {
        return booze._id;
    });
    Pub.findByIdAndUpdate(req.node._id, _sanatizeForUpdate(req.body), function (err, data) {
        if (err) {
            console.error(err);
        }
        res.json({ err: err });
    });
};

// Helper methods

var _sanatizeForUpdate = function (doc) {
    delete doc._id;
    delete doc.id;
    delete doc.__v;
    return doc;
};

module.exports.listByLocation = function (req, res) {
    var ll = req.query.ll.split(',').map(Number);
    var radius = req.query.r || SEARCH_RADIUS;
    var point = {
        type: 'Point',
        coordinates: ll.reverse()
    };
    var options = {
        spherical: true,
        maxDistance: radius / 6378137,
        distanceMultiplier: 6378137,
        lean: true
    };
    // Find all nearby pubs, then return the actual pubs, needs two
    // part search as geoNear returns locational puposes
    Pub.geoNear(point, options, function (err, pubs) {
        var ids = pubs.map(function (term) {
            return term.obj._id;
        });
        Pub.find().where('_id').in(ids)
            .populate('boozes')
            .exec(function (err, pubs) {
                res.json(pubs);
            });
    });
};
