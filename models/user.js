var crypto = require('crypto');

'use strict';
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    username: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    getterMethods: {
      username: function () {
        return this.getDataValue('username').toLowerCase();
      }

    },
    setterMethods: {
      password: function (password) {
        var hashed = crypto
                        .createHash('md5')
                        .update(password)
                        .digest('hex');
        this.setDataValue('password', hashed);
      }
    },
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return User;
};