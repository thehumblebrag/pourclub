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
            name: beer.name,
            style: beer.style && beer.style.name,
            description: beer.description,
            abv: beer.abv,
            creator_name: beer.breweries && beer.breweries[0].name,
            image: beer.labels && beer.labels.large
        });
        new_beer.save(function (err) {
            if (err) {
                return console.error(err);
            }
            console.log('+ added', new_beer.name);
        });
    });
};

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
