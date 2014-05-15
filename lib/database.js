var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/tapthat');
module.exports = mongoose;
