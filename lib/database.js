var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/pourclub');
module.exports = mongoose;
