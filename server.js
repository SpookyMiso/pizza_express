var config = require('./config/config.json');
var express = require('express');

var app = express();
var bodyParser = require('body-parser');

var path = require('path');
var jade = require('jade');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;


var sequelize = require('sequelize');
var models = require('./models');



passport.use( new LocalStrategy(
  function (username, password, done) {
    done();
  })
);

app.set('views', path.resolve(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(bodyParser.urlencoded({ extended: false}));

app.get('/users', function (req, res) {
  return res.json({ message: 'success!'});
});

app.get('/login', function (req, res) {
  return res.render('form');
});

app.post('/login', passport.authenticate('local', {
  successRedirect: '/users',
  failureRedirect: '/login',
  session: false
}));

models.sequelize
  .sync()
  .then(function () {
    var server = app.listen(3000, function () {
      console.log("HEY, PAY ATTENTION TO MEEEE");
  });

});

