var mongoose = require('../lib/database');

var Booze = new Schema({
	name: String,
	style: String,
	image: ObjectId,
	description: String,
	abv: Number,
	creator_id: [{ type: ObjectId, ref: 'Creator' }],
  });