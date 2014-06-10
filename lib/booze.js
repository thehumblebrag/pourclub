var async = require('async');
var Booze = require('../models/booze');
var Creator = require('../models/creator');

module.exports.search = function (search, callback) {
    var limit = 1;
    return Booze.textSearch(search, { limit: limit, lean: true }, function (err, results) {
        if (err) callback(err);
        async.map(results.results, function (result, done) {
            return Booze.populate(result.obj, 'creator', done);
        }, function (err, boozes) {
            if (err) callback(err);
            callback(null, boozes);
        });
    });
};

module.exports.searchOne = function (search, callback) {
    var limit = 1;
    return Booze.textSearch(search, { limit: limit, lean: true }, function (err, results) {
        if (err) callback(err);
        if (results.results.length) {
            return callback(null, results.results[0].obj);
        }
        callback(null, null);
    });
};
