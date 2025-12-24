const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }
      return context.user;
    },
  },

  Mutation: {
    signup: async (parent, { username, email, password }) => {
      // Check if user already exists
      const existingUser = await User.findOne({
        $or: [{ email }, { username }]
      });

      if (existingUser) {
        throw new Error('User with this email or username already exists');
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create the new user
      const user = new User({
        username,
        email,
        password: hashedPassword
      });

      const savedUser = await user.save();

      // Generate JWT token
      const token = jwt.sign(
        { userId: savedUser.id },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return {
        token,
        user: {
          id: savedUser.id,
          username: savedUser.username,
          email: savedUser.email,
          createdAt: savedUser.createdAt
        }
      };
    },

    login: async (parent, { email, password }) => {
      // Find user by email
      const user = await User.findOne({ email });

      if (!user) {
        throw new Error('Invalid email or password');
      }

      // Check if password is correct
      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        throw new Error('Invalid email or password');
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return {
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          createdAt: user.createdAt
        }
      };
    },
  },
};

module.exports = resolvers;