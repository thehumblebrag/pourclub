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
var routes = require('./routes')(app);

app.listen(process.env.PORT || config.port, function () {
    console.log('Prepared to pour.');
});
