var auth = require('./auth');
var drink = require('./drink');
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
    app.param('drink_id', drink.param);
    app.route('/api/drink')
        .get(drink.list)
        .post(drink.save);
    app.route('/api/drink/:drink_id')
        .get(drink.get)
        .put(drink.update)
        .delete(drink.delete);

};
