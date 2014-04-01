var express = require('express')
  , app = express();

var routes = require('./routes');

app.get('/', function(req, res) {
    res.send('TAP THAT!');
});

app.get('/pubs.json', routes.pub.all);

app.listen(3000);
