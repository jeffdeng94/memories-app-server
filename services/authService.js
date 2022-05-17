import User from '../models/user.js'

export const userDbFind = async email => {
  return await User.findOne({ email })
}

export const userDbCreate = async (
  email,
  hasedPassword,
  firstName,
  lastName,
) => {
  return await User.create({
    email,
    password: hasedPassword,
    name: `${firstName} ${lastName}`,
  })
}
