const { StatusCodes } = require('http-status-codes')
const jwt = require('jsonwebtoken')
const {
  UnauthenticatedError,
  NotFoundError,
  BadRequestError,
} = require('../errors')
const { attachCookiesToResponse, createTokenUser } = require('../utils')
const User = require('../models/UserModel')

const register = async (req, res) => {
  const { name, email, password } = req.body
  const isUserExist = await User.findOne({ email })
  if (isUserExist) {
    throw new BadRequestError('email already exists')
  }
  const documentCount = (await User.countDocuments()) === 0
  const role = documentCount ? 'admin' : 'user'
  const user = await User.create({ name, email, password, role })
  const tokenUser = createTokenUser(user)
  attachCookiesToResponse(res, tokenUser)
  res.status(StatusCodes.CREATED).json({ user: { tokenUser } })
}

const login = async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    throw new BadRequestError('please provide the credentials')
  }
  const user = await User.findOne({ email })
  if (!user) {
    throw new NotFoundError(` no user with email:${email}`)
  }
  const tokenUser = createTokenUser(user)
  const isPasswordMatch = user.comparePasswords(password)
  if (!isPasswordMatch) {
    throw new UnauthenticatedError('not authorized to access this route')
  }
  attachCookiesToResponse(res, tokenUser)
  res.status(StatusCodes.CREATED).json({ user: { tokenUser } })
}
// by doing this ... you know what we are doing
// we are actually removing the cookie from the browser
const logout = async (req, res) => {
  res.cookie('token', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now()),
  })
  res.status(StatusCodes.OK).json({ msg: 'user logged out' })
}

module.exports = { register, login, logout }
