var Booze = require('../models/booze');

module.exports.all = function (req, res) {

    Booze.find(function (err, boozes) {
        if (err) {
            return console.error(err);
        }
        res.json(boozes);
    });

};
