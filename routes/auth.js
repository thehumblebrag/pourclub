/**
 * Routes: auth
 *
 * Setup user authentication through Twitter to track
 * and manage user's updating content.
 */

var config = require('../config');
var passport = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy;
var User = require('../models/user');

// Serialize just store the document id
passport.serializeUser(function (user, done) {
    done(null, user);
});

// Load user from stored document id
passport.deserializeUser(function (user, done) {
    done(null, user);
});

passport.use(new TwitterStrategy({
    consumerKey: config.twitter.key,
    consumerSecret: config.twitter.secret,
    callbackURL: "http://localhost:3000/auth/twitter/callback"
},
function(token, secret, profile, done) {
    // Find or create a new user
    User.findOne({ service_id: profile.id }, function (err, user) {
        if (err) {
            return done(err);
        }
        if (!user) {
            user = new User({
                service_id: profile.id,
                username: profile.username,
                service: 'twitter'
            });
            return user.save(done);
        }
        done(null, user);
    });
}));
