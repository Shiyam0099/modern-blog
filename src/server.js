import { GraphQLServer, PubSub } from 'graphql-yoga';
import db from './db';
import { resolvers } from './reslovers/index';

const models = require('../models');
models.sequelize.authenticate();
models.sequelize.sync();

const pubsub = new PubSub();

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context(request) {
    //from context: {.....} [as an object] to context(){} [as a function]
    return {
      db,
      pubsub,
      models,
      request,
    };
  },
});

server.start(() => {
  console.log(`The server is up!`);
});
