"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define(
    "posts",
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
        onDelete: "CASCADE",
        references: {
          model: "users",
          key: "id",
        },
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
      },
      body: {
        type: DataTypes.STRING,
      },
      published: {
        type: DataTypes.BOOLEAN,
      },
      onDelete: "cascade",
      // comments: {
      //   type: [DataTypes.INTEGER],
      //   references: {
      //     model: {
      //       tableName: "comments",
      //       schema: "schema",
      //     },
      //     key: "id",
      //   },
      //   allowNull: false,
      // },
    },
    {}
  );
  // Post.associate = function (models) {
  //   Post.belongsTo(models.users, {
  //     foreignKey: "id",
  //   });
  // };
  return Post;
};
