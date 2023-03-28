const jwt = require('jsonwebtoken')
const { StatusCodes } = require('http-status-codes')
const createJWT = (payload) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  })
  return token
}
const isTokenValid = (token) => {
  const isTokenValid = jwt.verify(token, process.env.JWT_SECRET)
  return isTokenValid
}
const attachCookiesToResponse = (res, payload) => {
  const token = createJWT(payload)
  res.cookie('token', token, {
    httpOnly: true,
    expires: new Date(Date.now() + 8 * 3600000),
    secure: process.env.NODE_ENV === 'production' ? true : false,
    signed: true,
  })
}
const createTokenUser = (user) => {
  console.log(user)
  return {
    name: user.name,
    userId: user._id,
    role: user.role,
  }
}
module.exports = {
  isTokenValid,
  createJWT,
  attachCookiesToResponse,
  createTokenUser,
}
