var auth = require('./auth');
var booze = require('./booze');
var passport = require('passport');
var pub = require('./pub');

module.exports = function (app) {

    // Application view
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
    app.param('pub_id', pub.param);
    app.route('/api/pub')
        .get(pub.list)
        .post(pub.save);
    app.route('/api/pub/:pub_id')
        .get(pub.get)
        .put(pub.update)
        .delete(pub.delete);

    // Drink API
    app.param('booze_id', booze.param);
    app.route('/api/booze')
        .get(booze.list)
        .post(booze.save);
    app.route('/api/booze/:booze_id')
        .get(booze.get)
        .put(booze.update)
        .delete(booze.delete);

};
