var express = require('express')
  , app = express();

// Server configuration
app.set('views', 'templates');
app.set('view engine', 'jade');
app.engine('jade', require('jade').__express);
app.use(express.static(__dirname + '/public'));

var routes = require('./routes');

// HTML routes
app.get('/fuck', function (req, res) {
    res.render('index');
});
app.get('/map', function (req, res) {
    res.render('map');
});
app.get('/pub', function (req, res) {
	res.render('pub');
});

// JSON routes
app.get('/pubs.json', routes.pub.all);

// API
app.get('/pubs/nearby', routes.pub.nearby);

app.listen(3000);
