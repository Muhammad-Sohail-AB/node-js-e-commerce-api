const express = require('express')
const router = express.Router()
const {
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  createOrder,
  updateOrder,
} = require('../controllers/orderController')
const {
  authorizePermissions,
  authenticateUser,
} = require('../middleware/authentication')
router
  .route('/')
  .post(authenticateUser, createOrder)
  .get(authenticateUser, authorizePermissions('admin'), getAllOrders)
router
  .route('/getCurrentUserOrders')
  .get(authenticateUser, getCurrentUserOrders)
router
  .route('/:id')
  .get(authenticateUser, getSingleOrder)
  .patch(authenticateUser, updateOrder)

module.exports = router
