var crypto = require('crypto');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var models = require('../models');
var User = models.User;

passport.serializeUser(function (user, done) {
  console.log('serializing user...');
  done(null, user.id);
});

passport.deserializeUser( function (id, done) {
  return User.findOne({
    where: { 'id': id }
  })
  .then(function(user) {
  done(null, user);
  });
});

passport.use( new LocalStrategy(
  function (username, password, done) {
    User.findOne({
      where: { "username": username }
    })
      .then(function (user) {
        if(!user) {
          console.log('no user found!');
          return done(null, false, {message: "User not found!"});
        }
        var hashed = crypto
                        .createHash('md5')
                        .update(password)
                        .digest('hex');

        if (user.password !== hashed) {
          console.log('wrong password!');
          return done(null, false, {message: "incorrect password!"});
        }
        done(null, user);
      })
      .catch(done);
  })
);


module.exports = function (app) {
  app.use(passport.initialize());
  app.use(passport.session());
};