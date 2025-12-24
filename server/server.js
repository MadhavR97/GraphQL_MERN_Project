const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
const typeDefs = require('./schema/typeDefs');
const resolvers = require('./schema/resolvers');
const jwt = require('jsonwebtoken');
const express = require('express');

// MongoDB connection - updated to use modern options
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/graphql-auth')
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

async function startServer() {
  const app = express();
  
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      // Get the user token from the headers
      const token = req.headers.authorization || '';
      
      // Try to retrieve a user with the token
      let user = null;
      if (token) {
        try {
          // Remove "Bearer " prefix if present
          const tokenWithoutBearer = token.replace('Bearer ', '');
          user = jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET || 'default_secret');
        } catch (err) {
          // Invalid token, user remains null
        }
      }

      // Return context object
      return {
        user,
      };
    },
  });

  await server.start();
  server.applyMiddleware({ app });

  app.listen({ port: 4000 }, () => {
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
  });
}

startServer().catch(err => {
  console.error('Error starting server:', err);
});