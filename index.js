var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var express = require('express');
var passport = require('passport');
var session = require('express-session');

var config = require('./config');
var app = express();

// Server configuration
app.set('views', 'templates');
app.set('view engine', 'jade');
app.engine('jade', require('jade').__express);
app.use(express.static(__dirname + '/public'));
app.use(bodyParser());
app.use(cookieParser());

// Authentication
app.use(session({ secret: 'e67a8ac63fc5ff2550bcf8f88dcc3807' }));
app.use(passport.initialize());
app.use(passport.session());

// Routes
var routes = require('./routes');

app.get('/', function (req, res) {
    res.render('index');
});

// Auth
app.get('/auth/twitter', passport.authenticate('twitter'));
app.get('/auth/twitter/callback', passport.authenticate('twitter', {
    successRedirect: '/',
    failureRedirect: '/fail'
}));

// Pub API
app.param('pub_id', routes.pub.param);
app.route('/api/pub')
    .get(routes.pub.list)
    .post(routes.pub.save);
app.route('/api/pub/:pub_id')
    .get(routes.pub.get)
    .put(routes.pub.update)
    .delete(routes.pub.delete);

// Drink API
app.param('drink_id', routes.drink.param);
app.route('/api/drink')
    .get(routes.drink.list)
    .post(routes.drink.save);
app.route('/api/drink/:drink_id')
    .get(routes.drink.get)
    .put(routes.drink.update)
    .delete(routes.drink.delete);

app.listen(process.env.PORT || config.port, function () {
    console.log('Prepared to pour.');
});
