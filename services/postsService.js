import PostMessage from '../models/postMessage.js'

export const getAll = async () => {
  return await PostMessage.find()
}

export const postDbSave = async (post, userId) => {
  const newPost = new PostMessage({
    ...post,
    creator: userId,
    createdAt: new Date().toISOString(),
  })

  await newPost.save()

  return newPost
}

export const postDbUpdate = async (postId, post) => {
  return await PostMessage.findByIdAndUpdate(
    postId,
    { ...post, postId },
    {
      new: true,
    },
  )
}

export const postDbRemove = async postId => {
  await PostMessage.findByIdAndRemove(postId)
}

export const postDbLike = async (postId, userId) => {
  const post = await PostMessage.findById(postId)

  const index = post.likes.findIndex(id => id === String(userId))
  if (index === -1) {
    //id not exists, then add to the array
    post.likes.push(userId)
  } else {
    //id exists,remove likes
    post.likes = post.likes.filter(id => id !== String(userId))
  }

  return await PostMessage.findByIdAndUpdate(postId, post, {
    new: true,
  })
}
