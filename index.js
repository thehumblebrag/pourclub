var express = require('express')
  , app = express();

// Server configuration
app.set('views', 'templates');
app.set('view engine', 'jade');
app.engine('jade', require('jade').__express);

var routes = require('./routes');

// HTML routes
app.get('/', function (req, res) {
    res.render('index');
});
app.get('/map', function (req, res) {
    res.render('map');
});

// JSON routes
app.get('/pubs.json', routes.pub.all);

app.listen(3000);
