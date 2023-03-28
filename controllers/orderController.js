const { BadRequestError } = require('../errors')
const { StatusCodes } = require('http-status-codes')

const Product = require('../models/ProductModel')
const Order = require('../models/OrderModel')
const { checkPermissions } = require('../utils')

const fakeStripeCommunication = async ({ currency }) => {
  const clientSecret = 'ClientSecret'
  return { clientSecret }
}

const createOrder = async (req, res) => {
  const { tax, shippingFee, items: cartItems } = req.body
  if (!tax || !shippingFee) {
    throw new BadRequestError('please provide the tax and shipping fee')
  }
  if (!cartItems || cartItems.length < 1) {
    throw new BadRequestError('please provide the cart items')
  }
  let orderItems = []
  let subtotal = 0
  for (item of cartItems) {
    const dbProduct = await Product.findOne({ _id: item.product })
    if (!dbProduct) {
      throw new BadRequestError(`no product with id:${item.product}`)
    }
    const { name, price, image, _id } = dbProduct
    const singleOrderItem = {
      amount: item.amount,
      product: _id,
      name,
      price,
      image,
    }
    // add item to order
    orderItems = [...orderItems, singleOrderItem]
    // calculate sub total
    subtotal += item.amount * price
  }
  const total = subtotal + shippingFee + tax
  const paymentIntent = await fakeStripeCommunication({
    currency: 'USD',
    amount: total,
  })
  const order = await Order.create({
    orderItems,
    total,
    subtotal,
    tax,
    shippingFee,
    clientSecret: paymentIntent.client_secret,
    user: req.user.userId,
  })
  res.status(StatusCodes.OK).json({
    order,
    clientSecret: order.clientSecret,
  })
}

const getAllOrders = async (req, res) => {
  const orders = await Order.find({})
  res.status(200).json({ orders, numOfHits: orders.length })
}

const getSingleOrder = async (req, res) => {
  const { id: orderId } = req.params
  const order = await Order.findOne({ _id: orderId })
  if (!order) {
    throw new BadRequestError(`no order exists with id:${id}`)
  }
  checkPermissions(req.user, order.user)
  res.status(200).json({ order })
}

const updateOrder = async (req, res) => {
  const { id: orderId } = req.params
  const { paymentIntentId } = req.body
  const order = await Order.findOne({ _id: orderId })
  if (!order) {
    throw new BadRequestError(`no order exists with id:${id}`)
  }
  checkPermissions(req.user, order.user)
  order.paymentIntentId = paymentIntentId
  order.status = 'paid'
  res.status(200).json({ order })
}

const getCurrentUserOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user.userId })
  res.status(200).json({ orders })
}

module.exports = {
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  createOrder,
  updateOrder,
}
