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

// Virtuals for longitude and latitude
schema.virtual('location.latitude').get(function() {
    return this.location[1];
});
schema.virtual('location.longitude').get(function() {
    return this.location[0];
});

var Pub = mongoose.model('Pub', schema);

// Methods

// Export module

module.exports = Pub;
