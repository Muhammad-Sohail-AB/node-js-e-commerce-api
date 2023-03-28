const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthorizedError } = require('../errors')
const { isTokenValid } = require('../utils')

const authenticateUser = async (req, res, next) => {
  const token = req.signedCookies.token
  if (!token) {
    throw new BadRequestError('authentication invalid')
  }
  try {
    const payload = isTokenValid(token)
    req.user = { ...payload }
    next()
  } catch (error) {
    throw new BadRequestError('authentication invalid')
  }
}
const authorizePermissions = (...roles) => {
  return (req, res, next) => {
    const user = req.user
    if (!roles.includes(user.role)) {
      throw new UnauthorizedError('not authorized to access this route')
    }
    next()
  }
}
module.exports = { authenticateUser, authorizePermissions }
