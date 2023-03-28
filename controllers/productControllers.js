const { StatusCodes } = require('http-status-codes')
const { BadRequestError } = require('../errors')
const path = require('path')
const Product = require('../models/ProductModel')
const Review = require('../models/ReviewModel')

const createProduct = async (req, res) => {
  req.body.user = req.user.userId
  const product = await Product.create({ ...req.body })
  res.status(StatusCodes.CREATED).json({ product })
}
const getAllProducts = async (req, res) => {
  const products = await Product.find({}).populate({ path: 'reviews' })

  res.status(StatusCodes.OK).json({ products })
}
const getSingleProduct = async (req, res) => {
  const { id } = req.params
  const product = await Product.findOne({ _id: id }).populate({
    path: 'reviews',
  })
  if (!product) {
    throw new BadRequestError(`cannot find a product with id :${id}`)
  }
  res.status(StatusCodes.OK).json({ product })
}
const updateProduct = async (req, res) => {
  const { id } = req.params
  const product = await Product.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
    runValidators: true,
  })
  if (!product) {
    throw new BadRequestError(`cannot find a product with id :${id}`)
  }
  res.status(StatusCodes.OK).json({ product })
}
const deleteProduct = async (req, res) => {
  const { id } = req.params
  const product = await Product.findOne({ _id: id })
  if (!product) {
    throw new BadRequestError(`cannot find a product with id :${id}`)
  }
  await product.remove()
  res.status(StatusCodes.OK).json({ product })
}
const uploadProductImage = async (req, res) => {
  const image = req.files.image
  console.log(image)
  imagePath = path.resolve(__dirname, '../public/uploads/', image.name)
  await image.mv(imagePath)
  res.send(response)
}
const getProductReviews = async (req, res) => {
  const { id: productId } = req.params
  const reviews = await Review.find({ product: productId })
  res.status(StatusCodes.OK).json({ reviews, count: reviews.length })
}
module.exports = {
  getAllProducts,
  getSingleProduct,
  deleteProduct,
  updateProduct,
  uploadProductImage,
  createProduct,
  getProductReviews,
}
