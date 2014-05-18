var mongoose = require('../lib/database');

var schema = new mongoose.Schema({
	name: String,
	style: String,
	//image: ObjectId,
	description: String,
	abv: Number,
    creator_name: String,
	//creator_id: [{ type: ObjectId, ref: 'Creator' }],
});

var Booze = mongoose.model('Booze', schema);

module.exports = Booze;
