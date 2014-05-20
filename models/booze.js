var mongoose = require('../lib/database');

var schema = new mongoose.Schema({
    name: String,
    style: String,
    description: String,
    abv: Number,
    creator_name: String,
    image: String
});

var Booze = mongoose.model('Booze', schema);

module.exports = Booze;
