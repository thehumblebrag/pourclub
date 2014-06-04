var express = require('express');
var bodyParser = require('body-parser');
var config = require('./config');

var app = express();

// Server configuration
app.set('views', 'templates');
app.set('view engine', 'jade');
app.engine('jade', require('jade').__express);
app.use(express.static(__dirname + '/public'));
app.use(bodyParser());

// Setup available routes
var routes = require('./routes');

app.get('/', function (req, res) {
    res.render('index');
});

// Pub API
app.param('pub_id', routes.pub.param);
app.route('/api/pub')
    .get(routes.pub.list)
    .post(routes.pub.save);
app.route('/api/pub/:pub_id')
    .get(routes.pub.get)
    .put(routes.pub.update)
    .delete(routes.pub.delete);

// Booze API
app.param('booze_id', routes.booze.param);
app.route('/api/booze')
    .get(routes.booze.list)
    .post(routes.booze.save);
app.route('/api/booze/:booze_id')
    .get(routes.booze.get)
    .put(routes.booze.update)
    .delete(routes.booze.delete);

app.listen(process.env.PORT || config.port, function () {
    console.log('Ready to pour');
});
