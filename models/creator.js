var mongoose = require('../lib/database');

var Creator = new mongoose.Schema({
	name: String,
	location: String,
	description: String,
	brewerydb_id: String
});