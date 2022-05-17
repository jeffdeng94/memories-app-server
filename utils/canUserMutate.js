import User from '../models/user.js'
import PostMessage from '../models/postMessage.js'
import mongoose from 'mongoose'

export const canUserMutatePost = async (postId, userId) => {
  const user = await User.findById(userId)

  if (!user) {
    return {
      error: {
        message: 'user not found',
      },

      post: null,
    }
  }

  if (!mongoose.Types.ObjectId.isValid(postId))
    return {
      error: {
        message: `post id: ${postId} is not valid`,
      },

      post: null,
    }

  const post = await PostMessage.findById(postId)

  if (!post)
    return {
      error: {
        message: `no post with id: ${postId}`,
        post: null,
      },
    }

  if (post?.creator !== userId) {
    return {
      error: {
        message: 'post not own by user',
      },

      post: null,
    }
  }
}
