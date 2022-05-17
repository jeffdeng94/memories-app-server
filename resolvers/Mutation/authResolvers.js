import { userDbFind, userDbCreate } from '../../services/authService.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const authResolvers = {
  signup: async (
    root,
    { credentials: { email, password }, firstName, lastName, confirmPassword },
    context,
  ) => {
    try {
      const existingUser = await userDbFind(email)
      if (existingUser)
        return {
          error: {
            message: 'user alreay exist',
          },

          userInfo: {
            name: existingUser.name,
            email: existingUser.email,
            id: existingUser._id,
          },
          token: null,
        }

      if (password !== confirmPassword)
        return {
          error: {
            message: 'please confirm password',
          },

          userInfo: null,
          token: null,
        }

      const hasedPassword = await bcrypt.hash(password, 12)

      const result = await userDbCreate(
        email,
        hasedPassword,
        firstName,
        lastName,
      )

      const token = jwt.sign({ email: result.email, id: result._id }, 'test', {
        expiresIn: '1h',
      })

      return {
        error: null,
        userInfo: {
          name: result.name,
          email: result.email,
          id: result._id,
        },
        token,
      }
    } catch (error) {
      //server error
      return {
        error: {
          message: error.message,
        },

        userInfo: null,
        token: null,
      }
    }
  },

  signin: async (root, { credentials: { email, password } }, context) => {
    try {
      const existingUser = await userDbFind(email)

      if (!existingUser)
        return {
          error: {
            message: 'user does not exist, please sign up',
          },

          userInfo: null,
          token: null,
        }

      const isPasswordCorrect = await bcrypt.compare(
        password,
        existingUser.password,
      )

      if (!isPasswordCorrect)
        return {
          error: {
            message: 'Invalid credentials.',
          },

          userInfo: null,
          token: null,
        }

      const token = jwt.sign(
        { email: existingUser.email, id: existingUser._id },
        'test',
        { expiresIn: '1h' },
      )

      return {
        error: null,
        userInfo: {
          name: existingUser.name,
          email: existingUser.email,
          id: existingUser._id,
        },
        token,
      }
    } catch (error) {
      //server error
      return {
        error: {
          message: error.message,
        },

        userInfo: null,
        token: null,
      }
    }
  },
}
