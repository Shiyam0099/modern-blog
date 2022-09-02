import { v4 as uuidv4 } from 'uuid';
import { validate as isValidUUID } from 'uuid';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import JWT from 'jsonwebtoken';
import secretKey from '../keys';
import getUserId from '../utils/getUserId';

const Mutation = {
  async signup(parent, args, { db, models }, info) {
    const isEmail = validator.isEmail(args.data.email); //email format validation through validator package
    if (!isEmail) {
      throw new Error('Invalid Email format!');
    }
    const emailTaken = await models.users.findOne({
      where: { email: args.data.email },
    });
    if (emailTaken !== null) {
      throw new Error('Email already taken!');
    }

    const isValidPassword = validator.isLength(args.data.password, { min: 5 }); //setting password length
    if (!isValidPassword) {
      throw new Error(
        'Password is too short! At least 5 or more characters required.'
      );
    }

    const hashedPassword = await bcrypt.hash(args.data.password, 10); //hashing password

    const user = await models.users.create({
      id: uuidv4(),
      name: args.data.name,
      email: args.data.email,
      password: hashedPassword,
    });

    return {
      message: `User signed up successully!`,
      user: user,
      token: `${JWT.sign(
        {
          id: user.id,
        },
        secretKey,
        { expiresIn: 3600000 } //creating and returning token
      )}`,
    }; 
  },

  async signin(parent, args, { models }, info) {
    const user = await models.users.findOne({ where: { email: args.email } });
    if (user === null) {
      throw new Error('Invalid email address!');
    }

    const isUser = await bcrypt.compare(args.password, user.password);
    if (!isUser) {
      throw new Error('Wrong password!');
    }

    return {
      message: `Sign in complete!`,
      user: user,
      token: `${JWT.sign({ id: user.id }, secretKey, {
        //returning token
        expiresIn: 3600000,
      })}`,
    };
  },

  async deleteUser(parent, args, { db, models, request }, info) {
   
    const userId = getUserId(request);

    models.users.destroy({
      where: {
        id: userId,
      },
    });

    return `Your account deleted successfully!`;
  },
  async updateUser(parent, args, { db, models, request }, info) {
 

    const userId = getUserId(request);

    const emailTaken = await models.users.findOne({
      where: { email: args.data.email },
    });
    if (emailTaken !== null) {
      throw new Error('Email already taken!');
    }

    // if (typeof args.data.name === "string") {
    return await models.users
      .update(
        {
          name: args.data.name,
          email: args.data.email,
          password: `${await bcrypt.hash(args.data.password, 10)}`, //updation password and storing after hashing
        },
        {
          where: {
            id: userId,
          },
          returning: true,
          plain: true,
        }
      )
      .then((result) => {
        return result[1];
      });
    
  },
  async createPost(parent, args, { db, pubsub, models, request }, info) {
  

    const userId = getUserId(request);

    const createdPost = await models.posts.create({
      id: uuidv4(),
      title: args.data.title,
      body: args.data.body,
      published: args.data.published,
      author: userId,
    });

    if (args.data.published) {
      //subscription
      pubsub.publish('post', {
        post: {
          mutation: 'CREATED',
          data: createdPost,
        },
      });
    }

    return createdPost;

    
  },
  async deletePost(parent, args, { db, pubsub, models, request }, info) {
    const userId = getUserId(request);
    //check if post exists or not
    if (!isValidUUID(args.id)) {
      return Promise.reject('Invalid ID!');
    }
    const postFound = await models.posts.findOne({ where: { id: args.id } });
    if (postFound === null) {
      throw new Error('Post not found!');
    }
    if (postFound.author !== userId) {
      throw new Error('Invalid Operation!!');
    }

    models.posts.destroy({
      where: {
        id: args.id,
        author: userId,
      },
    });

    if (postFound.published) {
      //we checked if it is published because we don't want to show unpublished post
      pubsub.publish('post', {
        post: {
          mutation: 'DELETED',
          data: postFound,
        },
      });
    }
    return `Post deleted successfully!`;

  },
  async updatePost(parent, args, { db, pubsub, models, request }, info) {
    if (!isValidUUID(args.id)) {
      return Promise.reject('Invalid ID!');
    }
    const postFound = await models.posts.findOne({ where: { id: args.id } });
    if (postFound === null) {
      throw new Error('Post not found!');
    }

    const userId = getUserId(request);

    if (postFound.author !== userId) {
      throw new Error('Invalid Operation!!');
    }

    // if (typeof args.data.title === "string") {
    const updatedPost = await models.posts
      .update(
        {
          title: args.data.title,
          body: args.data.body,
          published: args.data.published,
        },
        {
          where: {
            id: args.id,
            author: userId,
          },
          returning: true, //must set returning 'true' to return object
          plain: true, // musts set plain true to not get unuseful messy data
        }
      )
      .then((result) => {
        return result[1]; //for postgres result = [x, y] and data is in 'y'
      });

    

    if (!postFound.published && updatedPost.published) {
      //create
      pubsub.publish('post', {
        post: {
          mutation: 'CREATED',
          data: updatedPost,
        },
      });
    } else if (postFound.published && !updatedPost.published) {
      //deleting all comments of that post when it is unpublished
      models.comments.destroy({
        where: {
          post: args.id,
        },
      });

      //subscripton part
      //delete
      pubsub.publish('post', {
        post: {
          mutation: 'DELETED',
          data: postFound,
        },
      });
    } else if (updatedPost.published) {
      //update
      pubsub.publish('post', {
        post: {
          mutation: 'UPDATED',
          data: updatedPost,
        },
      });
    }

    return updatedPost;
  },
  async createComment(parent, args, { db, pubsub, models, request }, info) {
    if (!isValidUUID(args.data.post)) {
      return Promise.reject('Invalid ID!');
    }
    

    const postFound = await models.posts.findOne({
      where: { id: args.data.post, published: true },
    });
    if (postFound === null) {
      throw new Error('Post not found!');
    }
  
    const userId = getUserId(request);

    const createdComment = await models.comments.create({
      id: uuidv4(),
      text: args.data.text,
      author: userId,
      post: args.data.post,
    }); 

    pubsub.publish(`comment ${args.data.post}`, {
      comment: {
        mutation: 'CREATED',
        data: createdComment,
      },
    });

    return createdComment;
  },

  async deleteComment(parent, args, { db, pubsub, models, request }, info) {
    //check if comment exists
    const userId = getUserId(request);

    if (!isValidUUID(args.id)) {
      return Promise.reject('Invalid ID!');
    }

    const commentFound = await models.comments.findOne({
      where: {
        id: args.id,
      },
    });

    if (commentFound === null) {
      throw new Error('Comment not found!');
    }

    
    if (commentFound.author !== userId) {
      throw new Error('Invalid Operation!!');
    }
    const deletedComment = await models.comments.destroy({
      where: {
        id: args.id,
        author: userId,
      },
    });

    //subscription
    pubsub.publish(`comment ${deletedComment.post}`, {
      comment: {
        mutation: 'DELETED',
        data: deletedComment,
      },
    });

    return `Comment deleted successfully!!`;
  },
  async updateComment(parent, args, { db, pubsub, models, request }, info) {
    

    const userId = getUserId(request);
    
    if (!isValidUUID(args.id)) {
      return Promise.reject('Invalid ID!');
    }

    const commentFound = await models.comments.findOne({
      where: {
        id: args.id,
      },
    });

    if (commentFound === null) {
      throw new Error('Comment not found!');
    }
    if (commentFound.author !== userId) {
      throw new Error('Invalid Operation!!');
    }

    const updatedComment = await models.comments
      .update(
        {
          text: args.data.text,
        },
        {
          where: {
            id: args.id,
            author: userId,
          },
          returning: true,
          plain: true,
        }
      )
      .then((result) => {
        return result[1];
      });

    pubsub.publish(`comment ${updatedComment.post}`, {
      comment: {
        mutation: 'UPDATED',
        data: updatedComment,
      },
    });

    return updatedComment;
  },
};

export { Mutation as default };
