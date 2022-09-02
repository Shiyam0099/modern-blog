"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define(
    "comments",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      author: {
        type: DataTypes.UUID,
        foreignKey: true,
        references: {
          model: "users",
          key: "id",
        },
      },
      post: {
        type: DataTypes.UUID,
        foreignKey: true,
        references: {
          model: "posts",
          key: "id",
        },
      },
      text: {
        type: DataTypes.STRING,
      },
    },
    {}
  );
  // User.associate = function (models) {
  //   User.hasMany(models.posts);
  // };
  return Comment;
};
