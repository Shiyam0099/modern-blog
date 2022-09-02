const Subscription = {
  count: {
    subscribe(parent, args, { pubsub }, info) {
      let count = 0;
      setInterval(() => {
        count++;
        pubsub.publish("count", {
          count: count,
        });
      }, 1000);

      return pubsub.asyncIterator("count");
    },
  },

  comment: {
    async subscribe(parent, args, { db, pubsub, models }, info) {
      const post = await models.posts.findOne({
        where: {
          id: args.postID,
          published: true,
        },
      });
      if (post === null) {
        throw new Error("Post not found!");
      }

      return pubsub.asyncIterator(`comment ${args.postID}`);
    },
  },

  post: {
    subscribe(parent, args, { db, pubsub }, info) {
      return pubsub.asyncIterator("post");
    },
  },
};

export { Subscription as default };
