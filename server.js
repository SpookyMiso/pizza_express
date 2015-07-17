var config = require('./config/config.json');

var path = require('path');

var express = require('express');
var app = express();

var bodyParser = require('body-parser');

// var jade = require('jade');

var session = require('express-session');
var models = require('./models');
var passport = require('passport');

var sequelize = require('sequelize');



app.set('views', path.resolve(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(bodyParser.urlencoded({ extended: false}));
app.use(session(config.session));
// set initialize passport
require('./app/auth.js')(app);

app.get('/users',
  function (req, res, next) {
    if(req.isAuthenticated()) {
      return next();
    }
    res.redirect('/login');
  },

  function (req, res) {
  return res.render('user', { user: req.user});
  });

app.get('/login', function (req, res) {
  return res.render('form');
});

app.post('/login', passport.authenticate('local', {
  successRedirect: '/users',
  failureRedirect: '/login',
  session: true
}));

app.get('/logout', function (req, res){
  req.logout();
  res.redirect('/login');
});

models.sequelize
  .sync()
  .then(function () {
    var server = app.listen(3000, function () {
      console.log("HEY, PAY ATTENTION TO MEEEE");
  });

});

