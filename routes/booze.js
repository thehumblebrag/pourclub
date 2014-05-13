var Booze = require('../models/booze');

module.exports.all = function (req, res) {
    var search = req.query.search;
    var limit = req.query.limit || 5;
    var filter = {};
    if (search) {
        console.log('search', search);
        filter = {
            name: new RegExp(search, 'i')
        };
    }
    Booze.find(filter).limit(limit).exec(function (err, boozes) {
        if (err) {
            return console.error(err);
        }
        res.json(boozes);
    });
};
