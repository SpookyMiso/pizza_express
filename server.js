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

var User = models.User;
var session = require('express-session');

passport.serializeUser(function (user, done) {
  console.log('serializing user...');
  done(null, user.id);
});

passport.deserializeUser( function (id, done) {
  return User.findOne({
    where: { 'id': id }
  })
  .then(function(user) {
  done(null, user.id);
  });
});

passport.use( new LocalStrategy(
  function (username, password, done) {
    User.findOne({
      where: { "username": username, "password": password }
    })
      .then(function (user) {
        if(!user) {
          console.log('no user found!');
          return done(null, false, {message: "User not found!"});
        }
        else if (user.password !== password) {
          console.log('wrong password!');
          return done(null, false, {message: "incorrect password!"});
        }
        done(null, user);
      })
      .catch(done);
      // .finally(done);
      //.finally(function () {
      //)};
  })
);

app.set('views', path.resolve(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(bodyParser.urlencoded({ extended: false}));
app.use(session(config.session));
app.use(passport.initialize());
app.use(passport.session());


app.get('/users',
  function (req, res, next) {
    if(req.isAuthenticated()) {
      return next();
    }
    res.redirect('/login');
  },

  function (req, res) {
  return res.json({ message: 'success!'});
  });

app.get('/login', function (req, res) {
  return res.render('form');
});

app.post('/login', passport.authenticate('local', {
  successRedirect: '/users',
  failureRedirect: '/login',
  session: true
}));

models.sequelize
  .sync()
  .then(function () {
    var server = app.listen(3000, function () {
      console.log("HEY, PAY ATTENTION TO MEEEE");
  });

});

