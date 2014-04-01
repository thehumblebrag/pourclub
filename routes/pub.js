var Pub = require('../models/pub');

module.exports.all = function (req, res) {

    Pub.find(function (err, pubs) {
        if (err) {
            return console.error(err);
        }
        res.json(pubs);
    });

};
