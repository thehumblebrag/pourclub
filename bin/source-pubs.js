var async = require('async');
var places = require('../lib/places');
var argv = process.argv.slice(2);

if (argv.length !== 2) {
    console.error('Bad arguments. Please use `bin/source-pubs.js {lat} {lng}`');
    process.exit(1);
}

var lat = argv[0];
var lng = argv[1];

console.log('Searching for Pubs near', [lat, lng].join(','));

places.nearLocation(lat, lng, function (err, pubs) {
    if (err) {
        return console.error(err);
    }
    async.each(pubs, function (pub, next) {
        pub.save(function (err, result) {
            if (err) {
                next(err);
            }
            console.log('+ added', pub.name);
            next();
        });
    }, function (err) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        console.log('Done yo. Imported', pubs.length, 'new pubs.');
        process.exit();
    });
});
