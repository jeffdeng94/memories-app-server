import { getAll } from '../services/postsService.js'

export const Query = {
  posts: async (root, args, context) => await getAll(),
}
