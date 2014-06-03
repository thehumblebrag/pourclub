/**
 * Model: Pub
 *
 * Represent a single location and a list of drinks that are
 * available at this location.
 */

var mongoose = require('../lib/database');
var ObjectId = mongoose.SchemaTypes.ObjectId;

// Schema options
var options = {
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
};

// Schema
var schema = new mongoose.Schema({
    name: String,
    location: {
        type: [Number],
        index: '2dsphere'
    },
    address: String,
    url: String,
    boozes: [{
        type: ObjectId,
        ref: 'Booze'
    }],
    foursquare_id: {
        type: String,
        index: { unique: true, dropDups: true }
    }
}, options);

// Virtual properties
schema.virtual('latitude').get(function() {
    return this.location[1];
});
schema.virtual('longitude').get(function() {
    return this.location[0];
});

// Methods

// Export module

var Pub = mongoose.model('Pub', schema);
module.exports = Pub;
