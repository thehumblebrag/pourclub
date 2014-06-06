/**
 * Routes: auth
 *
 * Setup user authentication through Twitter to track
 * and manage user's updating content.
 */

var config = require('../config');
var passport = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy;

// Serialize just store the document id
passport.serializeUser(function (user, done) {
    console.log('serialize', user);
    done(null, user);
});

// Load user from stored document id
passport.deserializeUser(function (user, done) {
    console.log('deserialize', user);
    done(null, user);
});

passport.use(new TwitterStrategy({
    consumerKey: config.twitter.key,
    consumerSecret: config.twitter.secret,
    callbackURL: "http://localhost:3000/auth/twitter/callback"
},
function(token, secret, profile, done) {
    console.log(token, secret);
    done(null, { token: token, secret: secret, profile: profile });
}));
