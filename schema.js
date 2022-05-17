import { gql } from 'apollo-server'

export const typeDefs = gql`
  scalar ISODate

  type Query {
    posts: [Post!]!
  }

  type Mutation {
    signup(
      credentials: CredentialsInput!
      firstName: String!
      lastName: String!
      confirmPassword: String!
    ): AuthPayload!
    signin(credentials: CredentialsInput!): AuthPayload!
    postCreate(post: PostInput!): PostPayload!
    postUpdate(postId: ID!, post: PostInput!): PostPayload!
    postDelete(postId: ID!): PostPayload!
    postLike(postId: ID!): PostPayload!
  }

  type Post {
    _id: ID
    title: String!
    message: String!
    name: String!
    creator: String!
    tags: [String!]!
    selectedFile: String
    likes: [String]!
    createdAt: ISODate!
  }

  type PostPayload {
    error: Error
    post: Post
  }

  type Error {
    message: String!
  }

  type AuthPayload {
    error: Error
    userInfo: UserInfo
    token: String
  }

  type UserInfo {
    name: String!
    email: String!
    id: String!
  }

  input CredentialsInput {
    email: String!
    password: String!
  }

  input PostInput {
    title: String!
    message: String!
    name: String!
    tags: [String!]!
    selectedFile: String
  }
`
