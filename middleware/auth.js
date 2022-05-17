import jwt from 'jsonwebtoken'

const auth = async auth => {
  try {
    if (!auth) return null
    const token = auth.split(' ')[1]
    const isCustomAuth = token.length < 500

    let decodedData

    if (token && isCustomAuth) {
      decodedData = jwt.verify(token, 'test')

      return decodedData?.id
    } else {
      //google token
      decodedData = jwt.decode(token)
      return decodedData?.sub
    }
  } catch (error) {
    console.log(error)
    return null
  }
}

export default auth
