var url = require('url');
var request = require('request');
var _ = require('underscore');

// Script configuration
var config = require('../config');
var api_key = config.brewerydb.api_key;
var api_url = 'api.brewerydb.com';

var Booze = require('../models/booze');
var Creator = require('../models/creator');

var getUrl = function (method, params) {
    var apiParams = {
        key: api_key,
        format: 'json'
    };
    return url.format({
        protocol: 'https',
        hostname: api_url,
        pathname: 'v2/' + method,
        query: _.extend(apiParams, params)
    });
};

var handleBeers = function (beers) {
    beers.forEach(function (beer) {
        var new_beer = new Booze({
            brewerydb_id: beer.id,
            name: beer.name,
            style: beer.style && beer.style.name,
            description: beer.description,
            abv: beer.abv,
            image: beer.labels && beer.labels.large
        });
        if (beer.breweries) {
            handleCreator(beer.breweries[0], function (err, creator) {
                new_beer.creator = creator;
                saveBeer(new_beer);
            });
        }
        else {
            saveBeer(new_beer);
        }
    });
};

var saveBeer = function (beer) {
    beer.save(function (err) {
        if (err && err.code == 11000) {
            console.log('- duplicate dropped', beer.name);
            return;
        }
        if (err) {
            return console.error(err);
        }
        console.log('+ added', beer.name);
    });
}

var handleCreator = function (brewery, callback) {
    var creator = new Creator({
        name: brewery.name,
        description: brewery.description,
        country: brewery.locations && brewery.locations[0].countryIsoCode,
        url: brewery.website,
        brewerydb_id: brewery.id
    })
    console.log('+ added brewery', creator.name);
    creator.save(function (err, creator) {
        if (err && err.code == 11000) {
            console.log(brewery.id);
            return Creator.findOne({ brewerydb_id: brewery.id }, function (err, brewery) {
                console.log('- duplicate found', brewery.name);
                callback(null, brewery);
            });
        }
        callback(err, creator);
    });
}

var getPageOfBeer = function (page) {
    request({ url: getUrl('beers', { p: page }), json: true }, function (err, response, body) {
        handleBeers(body.data);
    });
};

request({ url: getUrl('beers', { withBreweries: 'Y' }), json: true}, function (err, response, body) {
    // Do this to get the total pages of beer.
    if (err) {
        console.error(err);
    }
    else if (body.status == 'failure') {
        console.error('Error:', body.errorMessage);
    }
    else if (response.statusCode == 200) {
        // This is the first beer list, so handle it anyway.
        handleBeers(body.data);
        // Now get the rest.
        for (var i = 2; i < body.numberOfPages; i++) {
            getPageOfBeer(i);
        }
    }
});
