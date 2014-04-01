var mongoose = require('../lib/database');

// Schema

var schema = new mongoose.Schema({
    name: String,
    location: {
        latitude: Number,
        longitude: Number
    },
    address: String,
    url: String
});

var Pub = mongoose.model('Pub', schema);

// Methods

// Export module

module.exports = Pub;
