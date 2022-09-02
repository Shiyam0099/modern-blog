import getUserId from '../utils/getUserId';
const Sequelize = require('sequelize');

const User = {
  email: {
    //changed email from function to object
    // fragment: 'fragment userId on User {id}', //only asking for id
    resolve(parent, args, { models, request }, info) {
      //doing same thing as I'd do with function
      const userId = getUserId(request, false); //if logged in show only your email
      if (userId && userId === parent.id) {
        return parent.email;
      } else return null; // else show no one's email
    },
  },
  myProfile: {
    resolve(parent, args, { request }, info) {
      const userId = getUserId(request, false);
      if (userId && userId === parent.id) {
        return true;
      } else {
        return false;
      }
    },
  },
  posts: {
    // fragment: 'fragment userId on User {id}', //fragment not needed beacuse we are returning everthing from Query-users
    resolve(parent, args, { db, models, request }, info) {
      const userId = getUserId(request, false);
      if (userId && userId === parent.id) {
        return models.posts.findAll({
          //find posts which are published by logged in user regardless of pub/unpub
          where: {
            author: parent.id,
            [Sequelize.Op.or]: {
              published: true,
              author: userId,
            },
          },
          order: [['createdAt', 'ASC']],
        });
      } else {
        return models.posts.findAll({
          //if no user logged in then only show published posts
          where: {
            author: parent.id,
            published: true,
          },
          order: [['createdAt', 'ASC']],
        });
      }
    },
  },
  comments(parent, args, { db, models }, info) {
    return models.comments.findAll({
      where: {
        author: parent.id,
      },
      order: [['createdAt', 'ASC']],
    });
  },
};
export { User as default };
