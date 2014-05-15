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
    var geojson_point = { type: 'Point', coordinates: latlng.reverse() };
    var max_distance = req.query.d || 5000;
    var near_params = {
        spherical: true,
        max_distance: max_distance / 6378137,
        distanceMultiplier: 6378137
    };
    Pub.geoNear(geojson_point, near_params, function(err, data) {
        res.send(data);
    });
};
