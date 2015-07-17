var models = require('../models');

var User = models.User;

models.sequelize
  .sync({ force: true})
  .then(function() {
    return User.create(
     { username: 'bob', password: 'bob' }
    );

});