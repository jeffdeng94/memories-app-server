import mongoose from 'mongoose'
import PostMessage from '../models/postMessage.js'

export const getPosts = async (req, res) => {
  try {
    const postMessage = await PostMessage.find()
    res.status(200).json(postMessage)
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

export const createPost = async (req, res) => {
  const post = req.body

  const newPost = new PostMessage({
    ...post,
    creator: req.userId,
    createdAt: new Date().toISOString(),
  })

  try {
    await newPost.save()

    res.status(201).json(newPost)
  } catch (error) {
    res.status(409).json({ message: error.message })
  }
}

export const updatePost = async (req, res) => {
  const { id: _id } = req.params
  const post = req.body
  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send('No post with that id')
  try {
    const updatedPost = await PostMessage.findByIdAndUpdate(
      _id,
      { ...post, _id },
      {
        new: true,
      },
    )

    res.json(updatedPost)
  } catch (error) {
    console.log(error.message)
  }
}

export const deletePost = async (req, res) => {
  const { id } = req.params
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send('No post with that id')
  try {
    await PostMessage.findByIdAndRemove(id)

    res.json({ message: 'Post deleted successfully' })
  } catch (error) {
    res.status(409).json({ message: error.message })
  }
}

export const likePost = async (req, res) => {
  const { id } = req.params

  if (!req.userId) return res.json({ message: 'unauthenticated' })

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send('No post with that id')

  try {
    const post = await PostMessage.findById(id)

    const index = post.likes.findIndex(id => id === String(req.userId))
    if (index === -1) {
      //id not exists, then add to the array
      post.likes.push(req.userId)
    } else {
      //id exists,remove likes
      post.likes = post.likes.filter(id => id !== String(req.userId))
    }

    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, {
      new: true,
    })

    res.json(updatedPost)
  } catch (error) {
    res.status(409).json({ message: error.message })
  }
}
