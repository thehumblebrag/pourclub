var Pub = require('../models/pub');

module.exports.all = function (req, res) {

    Pub.find(function (err, pubs) {
        if (err) {
            return console.error(err);
        }
        res.json(pubs);
    });

};

module.exports.nearby = function (req, res) {

    var latlng = req.query.ll.split(',').map(Number);
    var geojsonPoint = { type: 'Point', coordinates: latlng.reverse() };
    var maxDistance = req.query.d || 5000;

    var nearParams = {
        spherical: true,
        maxDistance: maxDistance / 6378137,
        distanceMultiplier: 6378137
    };

    Pub.geoNear(geojsonPoint, nearParams, function(err, data) {
        res.send(data);
    });

};
