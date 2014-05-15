var url = require('url');
var request = require('request');
var _ = require('underscore');
var api_key = 'KEY_HERE';
var api_url = 'api.brewerydb.com';

var Booze = require('../models/booze');
var Creator = require('../models/creator');

function getUrl(method, params) {
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
}

function handleBeers(beers) {
    beers.forEach(function (beer) {
        console.log('Saving beer: ' + beer.name);
        var new_beer = new Booze({
            name: beer.name,
            style: beer.style && beer.style.name,
            description: beer.description,
            abv: beer.abv,
            creator_name: beer.breweries && beer.breweries[0].name
        });
        new_beer.save(function (err) {
            if (err) {
                console.log(err);
            }
        });
    });
}

function getPageOfBeer(pageNumber) {
    request({ url: getUrl('beers', { p: pageNumber }), json: true }, function (error, response, body) {
        handleBeers(body.data);
    });
}

request({ url: getUrl('beers', { withBreweries: 'Y' }), json: true}, function (error, response, body) {
    // Do this to get the total pages of beer.
    if (error) {
        console.error(error);
    }
    else if (body.status == 'failure') {
        console.error(body.errorMessage);
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
