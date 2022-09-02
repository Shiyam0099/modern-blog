"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define(
    "posts",
    {
      title: {
        type: DataTypes.STRING,
      },
      body: {
        type: DataTypes.STRING,
      },
      published: {
        type: DataTypes.BOOLEAN,
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
  Post.associate = function (models) {
    Post.belongsTo(models.users, {
      foreignKey: "author",
      onDelete: "CASCADE",
    });
    Post.hasMany(models.comments, {
      foreignKey: "post",
    });
  };
  return Post;
};
