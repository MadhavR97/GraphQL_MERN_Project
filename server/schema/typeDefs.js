const { gql } = require('graphql-tag');

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    createdAt: String!
  }

  type Post {
    id: ID!
    title: String!
    content: String!
    author: User!
    published: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    me: User
    posts: [Post!]!
    post(id: ID!): Post
    myPosts: [Post!]!
  }

  type Mutation {
    signup(username: String!, email: String!, password: String!): AuthPayload
    login(email: String!, password: String!): AuthPayload
    createPost(title: String!, content: String!): Post!
    updatePost(id: ID!, title: String, content: String, published: Boolean): Post!
    deletePost(id: ID!): Boolean!
  }
`;

module.exports = typeDefs;