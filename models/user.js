/**
 * Model: User
 *
 * Auth user to associate with additions for moderation,
 * tracking and banning purposes
 */

var mongoose = require('../lib/database');

// Schema options
var options = {
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
};

// Schema
var schema = new mongoose.Schema({
    username: String,
    service: String,
    created_at: Date,
    service_id: {
        type: String,
        index: { unique: true, dropDups: true }
    }
}, options);

// Virtual properties

// Methods

// Export module

var User = mongoose.model('User', schema);
module.exports = User;
