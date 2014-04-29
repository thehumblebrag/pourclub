var mongoose = require('../lib/database');

// Schema options
var schemaOptions = {
    toObject: {
        virtuals: true
    },
    toJSON: {
        virtuals: true
    }
};


// Schema
var schema = new mongoose.Schema({
    name: String,
    location: {
        type: [Number],
        index: '2dsphere'
    },
    address: String,
    url: String
}, schemaOptions);

// Virtuals for longitude and latitude
schema.virtual('latitude').get(function() {
    return this.location[1];
});
schema.virtual('longitude').get(function() {
    return this.location[0];
});

var Pub = mongoose.model('Pub', schema);

// Methods

// Export module

module.exports = Pub;
