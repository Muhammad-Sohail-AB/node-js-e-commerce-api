const express = require('express')
const router = express.Router()
const {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updatePassword,
} = require('../controllers/userControllers')
const {
  authenticateUser,
  authorizePermissions,
} = require('../middleware/authentication')
router
  .route('/')
  .get(authenticateUser, authorizePermissions('admin', 'owner'), getAllUsers)
router.route('/updateUser').patch(updateUser)
router.route('/updatePassword').patch(authenticateUser, updatePassword)
router.route('/showMe').get(authenticateUser, showCurrentUser)
router.route('/:id').get(authenticateUser, getSingleUser)
module.exports = router
