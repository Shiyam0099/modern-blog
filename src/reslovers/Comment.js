const Comment = {
  author(parent, args, { db, models }, info) {
    return models.users.findOne({
      where: {
        id: parent.author,
      },
    });
  },

  post(parent, args, { db, models }, info) {
    return models.posts.findOne({
      where: {
        id: parent.post,
      },
    });
  },
};

export { Comment as default };
