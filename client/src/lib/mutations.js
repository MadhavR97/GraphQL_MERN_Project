import { gql } from 'graphql-tag';

export const SIGNUP = gql`
  mutation Signup($username: String!, $email: String!, $password: String!) {
    signup(username: $username, email: $email, password: $password) {
      token
      user {
        id
        username
        email
        createdAt
      }
    }
  }
`;

export const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        username
        email
        createdAt
      }
    }
  }
`;

export const ME = gql`
  query Me {
    me {
      id
      username
      email
      createdAt
    }
  }
`;