/**
 * Routes: Pub
 *
 * CRUD based routes to handle user interaction of
 * TapThat pub listings.
 */

var Pub = require('../models/pub');

// Crud routes

module.exports.param = function (req, res, next, pub_id) {
    Pub.findById(pub_id, function (err, pub) {
        if (err) {
            return console.error(err);
        }
        req.node = pub[0];
        next();
    });
};

module.exports.list = function (req, res, next) {
    if (req.query.ll) {
        return module.exports.listByLocation(req, res);
    }
    Pub.find(function (err, pubs) {
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
    res.json({ err: false });
};

// Helper methods

module.exports.listByLocation = function (req, res) {
    var ll = req.query.ll.split(',').map(Number);
    var radius = req.query.r || 500;
    var point = {
        type: 'Point',
        coordinates: ll.reverse()
    };
    var options = {
        spherical: true,
        maxDistance: radius / 6378137,
        distanceMultiplier: 6378137
    };
    Pub.geoNear(point, options, function (err, pubs) {
        return res.json(pubs);
    });
};
