import {
  postDbSave,
  postDbUpdate,
  postDbRemove,
  postDbLike,
} from '../../services/postsService.js'

import { canUserMutatePost } from '../../utils/canUserMutate.js'

export const postResolvers = {
  postCreate: async (root, { post }, { userId }) => {
    if (!userId) {
      return {
        error: {
          message: 'unauthenticated',
        },

        post: null,
      }
    }

    if (!post.title || !post.message) {
      return {
        error: {
          message: 'you must provide title and message',
        },

        post: null,
      }
    }
    try {
      const newPost = await postDbSave(post, userId)
      return {
        error: null,
        post: newPost,
      }
    } catch (error) {
      console.log(error)
      return {
        error: {
          message: error.message,
        },

        post: null,
      }
    }
  },

  postUpdate: async (root, { postId, post }, { userId }) => {
    if (!userId) {
      return {
        error: {
          message: 'unauthenticated',
        },

        post: null,
      }
    }

    const error = await canUserMutatePost(postId, userId)

    if (error) return error

    if (!post.title || !post.message) {
      return {
        error: {
          message: 'you must provide title and message',
        },

        post: null,
      }
    }

    try {
      const newPost = await postDbUpdate(postId, post)
      return {
        error: null,
        post: newPost,
      }
    } catch (error) {
      return {
        error: {
          message: error.message,
        },
        post: null,
      }
    }
  },

  postDelete: async (root, { postId }, { userId }) => {
    if (!userId) {
      return {
        error: {
          message: 'unauthenticated',
        },

        post: null,
      }
    }

    const error = await canUserMutatePost(postId, userId)

    if (error) return error

    try {
      await postDbRemove(postId)
      return {
        error: null,
        post: null,
      }
    } catch (error) {
      return {
        error: {
          message: error.message,
        },
        post: null,
      }
    }
  },

  postLike: async (root, { postId }, { userId }) => {
    if (!userId) {
      return {
        error: {
          message: 'unauthenticated',
        },

        post: null,
      }
    }

    try {
      const updatedPost = await postDbLike(postId, userId)

      return {
        error: null,
        post: updatedPost,
      }
    } catch (error) {
      return {
        error: {
          message: error.message,
        },
        post: null,
      }
    }
  },
}
