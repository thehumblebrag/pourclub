var mongoose = require('../lib/database');

// Schema

var schema = new mongoose.Schema({
    name: String,
    location: {
        type: [Number],
        index: '2dsphere'
    },
    address: String,
    url: String
});

var Pub = mongoose.model('Pub', schema);

// Methods

// Export module

module.exports = Pub;
