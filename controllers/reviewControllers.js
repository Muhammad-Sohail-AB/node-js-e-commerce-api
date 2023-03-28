const Review = require('../models/ReviewModel')
const Product = require('../models/ProductModel')
const { BadRequestError, NotFoundError } = require('../errors')
const { StatusCodes } = require('http-status-codes')
const { checkPermissions } = require('../utils/index')

const createReview = async (req, res) => {
  req.body.user = req.user.userId
  const { product: productId } = req.body
  const isValidProduct = await Product.findOne({ _id: productId })
  if (!isValidProduct) {
    throw new NotFoundError(`cannot find a product with id:${productId}`)
  }
  const isAlreadyExist = await Review.findOne({
    product: productId,
    user: req.user.userId,
  })
  if (isAlreadyExist) {
    throw new BadRequestError(`already submitted a review for this product`)
  }
  const review = await Review.create({ ...req.body })
  res.status(StatusCodes.CREATED).json({ review })
}

const getReviews = async (req, res) => {
  const reviews = await Review.find({}).populate({
    path: 'product',
    select: 'name price description',
  })
  res.status(StatusCodes.OK).json({ reviews })
}

const getReview = async (req, res) => {
  const { id: reviewId } = req.params
  const review = await Review.findOne({ _id: reviewId })
  if (!review) {
    throw new NotFoundError(` cannot find a product with id:${reviewId}`)
  }
  res.status(StatusCodes.CREATED).json({ review })
}

const updateReview = async (req, res) => {
  const { id: reviewId } = req.params
  const { rating, title, comment } = req.body
  const review = await Review.findOne({ _id: reviewId })
  if (!review) {
    throw new NotFoundError(` cannot find a product with id:${reviewId}`)
  }
  checkPermissions(req.user, reviewId)

  review.title = title
  review.comment = comment
  review.rating = rating
  review.save()
  res.status(StatusCodes.CREATED).json({ review })
}

const deleteReview = async (req, res) => {
  const { id: reviewId } = req.params

  const review = await Review.findOne({ _id: reviewId })
  if (!review) {
    throw new NotFoundError(` cannot find a product with id:${reviewId}`)
  }
  checkPermissions(req.user, reviewId)

  review.remove()
  res.status(StatusCodes.CREATED).json({ review })
}

module.exports = {
  createReview,
  getReviews,
  getReview,
  updateReview,
  deleteReview,
}
