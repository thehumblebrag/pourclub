var mongoose = require('../lib/database');
var ObjectId = mongoose.SchemaTypes.ObjectId;

var schema = new mongoose.Schema({
    name: String,
    style: String,
    description: String,
    abv: Number,
    image: String,
    creator: {
        type: ObjectId,
        ref: 'Creator'
    },
    brewerydb_id: {
        type: String,
        index: { unique: true }
    }
});

var Booze = mongoose.model('Booze', schema);

module.exports = Booze;
