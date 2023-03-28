const { StatusCodes } = require('http-status-codes')
const { BadRequestError } = require('../errors')
const User = require('../models/UserModel')
const { attachCookiesToResponse, checkPermissions } = require('../utils')
const { createTokenUser } = require('../utils/jwt')

const getAllUsers = async (req, res) => {
  console.log(req.user)
  const users = await User.find({ role: 'user' }).select('-password')
  res.status(StatusCodes.OK).json({ users })
}
const getSingleUser = async (req, res) => {
  const { id: userId } = req.params
  const user = await User.findOne({ _id: userId }).select('-password')
  if (!user) {
    throw new BadRequestError(` cannot find a user with id:${userId}`)
  }
  checkPermissions(req.user, user._id)
  res.status(StatusCodes.OK).json({ user })
}
const showCurrentUser = async (req, res) => {
  res.status(StatusCodes.OK).json({ user: req.user })
}
const updateUser = async (req, res) => {
  res.send('update user')
}
const updatePassword = async (req, res) => {
  const { password, newPassword } = req.body
  if (!newPassword || !password) {
    throw new BadRequestError('please provide the credentials')
  }
  const user = await User.findOne({ _id: req.user.userId })
  if (!user) {
    throw new NotFoundError(` no user with email:${req.user.userId}`)
  }
  const tokenUser = createTokenUser(user)
  const isPasswordMatch = user.comparePasswords(password)
  if (!isPasswordMatch) {
    throw new UnauthenticatedError('not authorized to access this route')
  }
  user.password = newPassword
  await user.save()
  attachCookiesToResponse(res, tokenUser)
  res.status(StatusCodes.CREATED).json({ user: { tokenUser } })
}
module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updatePassword,
}
