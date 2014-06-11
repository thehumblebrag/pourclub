var mongoose = require('../lib/database');
var ObjectId = mongoose.SchemaTypes.ObjectId;
var search = require('mongoose-text-search');

var schema = new mongoose.Schema({
    name: String,
    style: String,
    description: String,
    abv: Number,
    image: String,
    search: String,
    creator: {
        type: ObjectId,
        ref: 'Creator'
    },
    brewerydb_id: {
        type: String,
        index: { unique: true, dropDups: true }
    }
});

// Indexes
schema.plugin(search);
schema.index({ search: 'text', name: 'text' });

var Drink = mongoose.model('Drink', schema);
module.exports = Drink;
