var mongoose = require('mongoose');

var Creator = new mongoose.Schema({
	name: String,
	location: String,
	description: String,
	brewerydb_id: String
});