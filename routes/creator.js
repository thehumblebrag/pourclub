var Creator = require('../models/creator');

module.exports.all = function (req, res) {

    Creator.find(function (err, creators) {
        if (err) {
            return console.error(err);
        }
        res.json(creators);
    });

};
