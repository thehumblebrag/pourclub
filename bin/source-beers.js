var _ = require('underscore');
var async = require('async');
var config = require('../config');
var request = require('request');
var url = require('url');
var Creator = require('../models/creator');
var Drink = require('../models/drink');

var api_key = config.brewerydb.api_key;
var api_url = 'api.brewerydb.com';

var getUrl = function (method, params) {
    params = _.extend({
        key: api_key,
        format: 'json'
    }, params);
    return url.format({
        protocol: 'https',
        hostname: api_url,
        pathname: 'v2/' + method,
        query: params
    });
};

var handleDrinks = function (drinks, callback) {
    async.each(drinks, function (drink, next) {
        var new_drink = new Drink({
            brewerydb_id: drink.id,
            name: drink.name,
            style: drink.style && drink.style.name,
            description: drink.description,
            abv: drink.abv,
            image: drink.labels && drink.labels.large
        });
        if (drink.breweries) {
            return handleCreator(drink.breweries[0], function (err, creator) {
                new_drink.creator = creator;
                new_drink.search = creator.name + ' ' + new_drink.name;
                return saveDrink(new_drink, next);
            });
        }
        else {
            saveDrink(new_drink, next);
        }
    }, callback);
};

var saveDrink = function (drink, callback) {
    drink.save(function (err, drink) {
        if (err && err.code == 11000) {
            console.warn('- duplicate dropped');
            return;
        }
        if (err) {
            return console.error(err);
        }
        console.log('+ added', drink.name);
        callback(null, drink);
    });
};

var handleCreator = function (brewery, callback) {
    var creator = new Creator({
        name: brewery.name,
        description: brewery.description,
        country: brewery.locations && brewery.locations[0].countryIsoCode,
        url: brewery.website,
        brewerydb_id: brewery.id
    });
    console.log('+ added brewery', creator.name);
    creator.save(function (err, creator) {
        if (err && err.code == 11000) {
            return Creator.findOne({ brewerydb_id: brewery.id }, function (err, brewery) {
                console.log('- duplicate found', brewery.name);
                return callback(null, brewery);
            });
        }
        callback(err, creator);
    });
};

var getPage = function (page, callback) {
    request({ url: getUrl('beers', { p: page, withBreweries: 'Y' }), json: true }, function (err, response, body) {
        console.log(page, body);
        handleDrinks(body.data, callback);
    });
};

request({ url: getUrl('beers', { withBreweries: 'Y' }), json: true}, function (err, response, body) {
    // Do this to get the total pages of drink.
    if (err) {
        console.error(err);
    }
    else if (body.status === 'failure') {
        console.error(new Error(body.errorMessage));
    }
    else if (response.statusCode === 200) {
        // This is the first drink list, so handle it anyway.
        handleDrinks(body.data);
        // Now get the rest.
        async.times(body.numberOfPages, function (n, next) {
            getPage(++n, next);
        }, function (err) {
            if (err) {
                console.error(1);
                process.exit(1);
            }
            process.exit();
        });
    }
});
