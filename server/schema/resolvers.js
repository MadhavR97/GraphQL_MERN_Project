const User = require('../models/User');
const Post = require('../models/Post');
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
    
    posts: async () => {
      return await Post.find().populate('author').sort({ createdAt: -1 });
    },
    
    post: async (parent, { id }) => {
      return await Post.findById(id).populate('author');
    },
    
    myPosts: async (parent, args, context) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }
      return await Post.find({ author: context.user.userId }).populate('author').sort({ createdAt: -1 });
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

    createPost: async (parent, { title, content }, context) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }
      
      const post = new Post({
        title,
        content,
        author: context.user.userId
      });
      
      const savedPost = await post.save();
      return await Post.findById(savedPost._id).populate('author');
    },
    
    updatePost: async (parent, { id, title, content, published }, context) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }
      
      const post = await Post.findById(id);
      
      if (!post) {
        throw new Error('Post not found');
      }
      
      // Check if the user owns the post
      if (post.author.toString() !== context.user.userId) {
        throw new Error('Not authorized to update this post');
      }
      
      const updatedPost = await Post.findByIdAndUpdate(
        id,
        { 
          ...(title !== undefined && { title }),
          ...(content !== undefined && { content }),
          ...(published !== undefined && { published })
        },
        { new: true }
      ).populate('author');
      
      return updatedPost;
    },
    
    deletePost: async (parent, { id }, context) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }
      
      const post = await Post.findById(id);
      
      if (!post) {
        throw new Error('Post not found');
      }
      
      // Check if the user owns the post
      if (post.author.toString() !== context.user.userId) {
        throw new Error('Not authorized to delete this post');
      }
      
      await Post.findByIdAndDelete(id);
      return true;
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