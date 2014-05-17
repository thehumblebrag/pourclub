var express = require('express');
var app = express();

// Server configuration
app.set('views', 'templates');
app.set('view engine', 'jade');
app.engine('jade', require('jade').__express);
app.use(express.static(__dirname + '/public'));

var routes = require('./routes');

// HTML routes
app.get('/', function (req, res) {
    res.render('index');
});

// Pub API
app.get   ('/api/pub',     routes.pub.list);
// app.get   ('/api/pub/:id', routes.pub.get);
// app.delete('/api/pub/:id', routes.pub.delete);
// app.post  ('/api/pub',     routes.pub.save);

// Beer API
// app.get('/boozes.json', routes.booze.list);

app.listen(3000);
