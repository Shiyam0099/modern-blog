'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define(
    'comments',
    {
      text: {
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
  Comment.associate = function (models) {
    Comment.belongsTo(models.posts, {
      foreignKey: 'post',
      onDelete: 'CASCADE',
    });
    Comment.belongsTo(models.users, {
      foreignKey: 'author',
      onDelete: 'CASCADE',
    });
  };
  return Comment;
};
