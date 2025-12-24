const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const mongoose = require('mongoose');
const typeDefs = require('./schema/typeDefs');
const resolvers = require('./schema/resolvers');
const jwt = require('jsonwebtoken');

// MongoDB connection - updated to use modern options
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/graphql-auth')
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Create Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Start the server
startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req }) => {
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
})
  .then(({ url }) => {
    console.log(`🚀 Server ready at: ${url}`);
  })
  .catch(err => {
    console.error('Error starting server:', err);
  });