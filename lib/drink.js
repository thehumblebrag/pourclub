var async = require('async');
var Drink = require('../models/drink');
var Creator = require('../models/creator');

module.exports.search = function (search, callback) {
    var limit = 1;
    return Drink.textSearch(search, { limit: limit, lean: true }, function (err, results) {
        if (err) {
            callback(err);
        }
        async.map(results.results, function (result, done) {
            return Drink.populate(result.obj, 'creator', done);
        }, function (err, drinks) {
            if (err) {
                callback(err);
            }
            callback(null, drinks);
        });
    });
};

module.exports.searchOne = function (search, callback) {
    var limit = 1;
    return Drink.textSearch(search, { limit: limit, lean: true }, function (err, results) {
        if (err) {
            callback(err);
        }
        if (results.results.length) {
            return callback(null, results.results[0].obj);
        }
        callback(null, null);
    });
};
