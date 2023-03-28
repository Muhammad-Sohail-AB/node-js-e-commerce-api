const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'please provide a value for name'],
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'please provide a value for email'],
    validate: {
      validator: validator.isEmail,
      message: 'please provide a valid email',
    },
  },
  password: {
    type: String,
    required: [true, 'please provide a password'],
  },
  role: {
    type: String,
    required: [true, 'please provide a value for role'],
    enum: ['user', 'admin'],
    default: 'user',
  },
})
UserSchema.pre('save', async function () {
  const salt = await bcrypt.genSalt(10)
  const newPassword = await bcrypt.hash(this.password, salt)
  this.password = newPassword
})
UserSchema.methods.comparePasswords = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password)
  return isMatch
}
module.exports = mongoose.model('User', UserSchema)
