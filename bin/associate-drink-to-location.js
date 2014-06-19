var async = require('async');
var drink = require('../lib/drink');
var untappd = require('../lib/untappd');
var Pub = require('../models/pub');

Pub.find({ drinks: [] }).limit(25).exec(function(err, pubs) {
    async.each(pubs, function (pub, done) {
        untappd.findBeersAtLocation(pub, function (err, beers) {
            if (err) {
                console.error(err);
                process.exit(1);
            }
            if (!beers) {
                done();
            }
            async.map(beers, function (beer, done) {
                drink.searchOne(beer.beer_name, done);
            },
            function (err, beers) {
                if (err) {
                    return done(err);
                }
                if (!beers) {
                    return done();
                }
                pub.drinks = beers;
                pub.save(done);
            });
        });
    }, function (err) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        process.exit();
    });
});
