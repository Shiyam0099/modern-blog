import getUserId from '../utils/getUserId';

const Sequelize = require('sequelize');

const paginate = ({ page = 0, pageSize = 5000 }) => {
  const offset = page * pageSize; //offset sets from which number, data will be presented
  const limit = pageSize; //limit set number of data per page

  return {
    offset,
    limit,
  };
};

const Query = {
  async posts(parent, args, { db, models, request }, info) {
    const userId = getUserId(request, false);

    const page = args.page;
    const pageSize = args.pageSize;

    if (args.findPost) {
      const postsMatched = await models.posts.findAll({
        //searching all post maching searched string and storing as array
        where: {
          [Sequelize.Op.or]: {
            //checking if searched string machtes any post title or body
            title: { [Sequelize.Op.iLike]: `%${args.findPost}%` }, //used % for searching a fragment of title, otherwise title: { [Sequelize.Op.iLike]: args.title }
            body: { [Sequelize.Op.iLike]: `%${args.findPost}%` }, //used % for searching a fragment of title, otherwise title: { [Sequelize.Op.iLike]: args.title }
          },
          published: true,
        },
        order: [['createdAt', 'ASC']],
        ...paginate({ page, pageSize }),
      });

      if (!postsMatched.length) {
        //if searched string didn't match any entry show error
        throw new Error('No matching posts!');
      }

      return postsMatched;
    }

    return models.posts.findAll({
      //show all posts that are published 
      where: {
        published: true,
      },
      order: [['createdAt', 'ASC']],
      ...paginate({ page, pageSize }),
    });

  },

  async myPosts(parent, args, { models, request }, info) {
    const userId = getUserId(request);
    if (args.search) {
      const myPosts = await models.posts.findAll({
        where: {
          [Sequelize.Op.or]: {
            //checking if searched string machtes any post title or body
            title: { [Sequelize.Op.iLike]: `%${args.search}%` }, //used % for searching a fragment of title, otherwise title: { [Sequelize.Op.iLike]: args.title }
            body: { [Sequelize.Op.iLike]: `%${args.search}%` }, //used % for searching a fragment of title, otherwise title: { [Sequelize.Op.iLike]: args.title }
          },
          author: userId,
        },
        order: [['createdAt', 'ASC']],
        ...paginate({ page: args.page, pageSize: args.pageSize }),
      });

      if (!myPosts.length) {
        throw new Error('No posts found!');
      }
      return myPosts;
    }

    return models.posts.findAll({
      where: {
        author: userId,
      },
      order: [['createdAt', 'ASC']],
      ...paginate({ page: args.page, pageSize: args.pageSize }),
    });
  },
  users(parent, args, { db, models }, info) {
    if (!args.id) {
      return models.users.findAll({
        order: [['name', 'ASC']], //sorting data by name in ascending order
        ...paginate({ page: args.page, pageSize: args.pageSize }),
      });
    }

    return models.users.findAll({
      where: {
        id: args.id,
      },
      ...paginate({ page: args.page, pageSize: args.pageSize }),
    });
  },

  comments(parent, args, { db, models }, info) {
    return models.comments.findAll({
      order: [['createdAt', 'ASC']],
      ...paginate({ page: args.page, pageSize: args.pageSize }),
    });
  },
};

export { Query as default };
