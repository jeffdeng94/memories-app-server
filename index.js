import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { ApolloServer } from 'apollo-server'
import { typeDefs } from './schema.js'
import { Query } from './resolvers/Query.js'
import { Mutation } from './resolvers/Mutation/Mutation.js'
import auth from './middleware/auth.js'

dotenv.config()

const server = new ApolloServer({
  typeDefs,
  resolvers: {
    Query,
    Mutation,
  },
  context: async ({ req }) => {
    const userId = await auth(req.headers.authorization)
    return { userId }
  },
})

mongoose
  .connect(process.env.CONNECTION_URL)
  .then(() => {
    console.log(`successfully connected to mongoDB`)
    server
      .listen()
      .then(({ url }) => console.log(`server is running on ${url}`))
  })
  .catch(error => console.log(error.message))
