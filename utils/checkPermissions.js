const { BadRequestError } = require('../errors')

const checkPermissions = (candidate, resource) => {
  if (candidate.role === 'admin') return
  if (candidate.userId === resource.toString()) return
  throw new BadRequestError('authentication invalid')
}
module.exports = checkPermissions
