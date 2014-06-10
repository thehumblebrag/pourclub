var async = require('async');
var booze = require('../lib/booze');
var untappd = require('../lib/untappd');
var Pub = require('../models/pub');

Pub.find(function(err, pubs) {
    async.each(pubs, function (pub, done) {
        untappd.findBeersAtFoursquareLocation("50488cc7e4b0d6e661d3ebc1", function (err, beers) {
            if (err) { console.error(err); process.exit(1); }
            async.map(beers, function (beer, done) {
                booze.searchOne(beer.beer_name, done);
            }, function (err, beers) {
                if (err) return done(err);
                if (!boozes) done();
                pub.boozes = beers;
                pub.save(done);
            });
        });
    });
});
