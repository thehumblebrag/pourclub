var async = require('async');
var booze = require('../lib/booze');
var untappd = require('../lib/untappd');
var Pub = require('../models/pub');

Pub.find().limit(1).exec(function(err, pubs) {
    async.each(pubs, function (pub, done) {
        untappd.findBeersAtLocation(pub, function (err, beers) {
            console.error(err, beers);
            if (err) {
                console.error(err);
                process.exit(1);
            }
            if (!beers) {
                done();
            }
            async.map(beers, function (beer, done) {
                booze.searchOne(beer.beer_name, done);
            },
            function (err, beers) {
                if (err) {
                    return done(err);
                }
                if (!beers) {
                    return done();
                }
                pub.boozes = beers;
                pub.save(done);
            });
        });
    }, function (err) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        console.log('Done');
        process.exit();
    });
});
