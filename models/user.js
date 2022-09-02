'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'users',
    {
      name: {
        type: DataTypes.STRING,
      },
      email: {
        type: DataTypes.STRING,
      },
      password: {
        type: DataTypes.STRING,
      },
      createdAt: {
        type: DataTypes.DATE,
      },
      updatedAt: {
        type: DataTypes.DATE,
      },
    },
    {}
  );
  User.associate = function (models) {
    User.hasMany(models.posts, {
      foreignKey: 'author',
    });
    User.hasMany(models.comments, {
      foreignKey: 'author',
    });
  };
  return User;
};
