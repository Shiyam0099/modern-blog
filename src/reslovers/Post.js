const Post = {
  author(parent, args, { db, models }, info) {
    return models.users.findOne({
      where: {
        id: parent.author,
      },
    });
  },
  comments(parent, args, { db, models }, info) {
    return models.comments.findAll({
      where: {
        post: parent.id,
      },
      order: [['createdAt', 'ASC']],
    });
  },
};

export { Post as default };
