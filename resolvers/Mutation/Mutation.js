import { postResolvers } from './postResolvers.js'
import { authResolvers } from './authResolvers.js'

export const Mutation = { ...postResolvers, ...authResolvers }
