var express = require('express')
  , app = express();

app.get('/', function(req, res) {
    res.send('TAP THAT!');
});

app.listen(3000);
