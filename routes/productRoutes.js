const express = require('express')
const router = express.Router()
const {
  getAllProducts,
  getSingleProduct,
  deleteProduct,
  updateProduct,
  uploadProductImage,
  createProduct,
  getProductReviews,
} = require('../controllers/productControllers')
const {
  authorizePermissions,
  authenticateUser,
} = require('../middleware/authentication')

router
  .route('/')
  .post([authenticateUser, authorizePermissions('admin')], createProduct)
  .get(getAllProducts)
router
  .route('/uploadImage')
  .post([authenticateUser, authorizePermissions('admin')], uploadProductImage)
router
  .route('/:id')
  .get(getSingleProduct)
  .delete([authenticateUser, authorizePermissions('admin')], deleteProduct)
  .patch([authenticateUser, authorizePermissions('admin')], updateProduct)

router.route('/:id/getProductReviews').get(getProductReviews)
module.exports = router
