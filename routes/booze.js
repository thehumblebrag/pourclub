/**
 * Routes: booze
 *
 * CRUD based routes to handle user interaction of
 * pourclub booze listings.
 */

var Booze = require('../models/booze');
var Creator = require('../models/creator');

// Crud routes

module.exports.param = function (req, res, next, booze_id) {
    Booze.findById(booze_id, function (err, booze) {
        if (err) {
            return console.error(err);
        }
        req.node = booze;
        next();
    });
};

module.exports.list = function (req, res, next) {
    var search = req.query.search;
    var limit = req.query.limit || 3;
    if (search) {
        return Booze.textSearch(search, { limit: limit, lean: true }, function (err, results) {
            if (err) {
                console.error(err);
            }
            res.json(results.results.map(function (result) {
                return result.obj;
            }));
        });
    }
    Booze.find().populate('creator').limit(limit).exec(function (err, boozes) {
        if (err) {
            return console.error(err);
        }
        res.json(boozes);
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
