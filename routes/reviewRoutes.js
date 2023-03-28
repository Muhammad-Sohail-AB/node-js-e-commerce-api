const express = require('express')
const router = express.Router()
const {
  createReview,
  getReviews,
  getReview,
  updateReview,
  deleteReview,
} = require('../controllers/reviewControllers')
const { authenticateUser } = require('../middleware/authentication')
router.route('/').post(authenticateUser, createReview).get(getReviews)
router
  .route('/:id')
  .patch(authenticateUser, updateReview)
  .delete(authenticateUser, deleteReview)
  .get(getReview)
module.exports = router
