var mongoose = require('../lib/database');

var schema = new mongoose.Schema({
	name: String,
	description: String,
    country: String,
    url: String,
	brewerydb_id: {
        type: String,
        index: { unique: true }
    }
});

var Creator = mongoose.model('Creator', schema);

module.exports = Creator;
