const express = require('express')
const { getAllProduct, getOneProduct, addProduct, adminDeleteProduct, removeProductImage, addProductImage, updateProduct, addProductBulk, getProductBySubcategory, getProductsInBatches, searchProduct } = require('../controllers/productController')
const router = express.Router()

const { isLoggedIn, customRole } = require('../middlewares/user')
// user routes
router.route("/products").get(getAllProduct)
router.route("/product/search").get(searchProduct)
router.route("/products/subcategory").post(getProductBySubcategory)
router.route("/products/subcategory/batches").post(getProductsInBatches)
router.route("/products/batches").get(getProductsInBatches)
router.route("/bulkproducts").post(isLoggedIn,customRole("admin"),addProductBulk)
router.route("/product/:id").get(getOneProduct).delete(isLoggedIn,customRole("admin"),adminDeleteProduct)

// admin routes
router.route("/admin/product/add").post(isLoggedIn,customRole("admin"),addProduct)
router.route("/admin/product/update/:productId").put(isLoggedIn,customRole("admin"),updateProduct)
router.route("/admin/images/remove/:productId").post(isLoggedIn,customRole("admin"),removeProductImage)
router.route("/admin/images/add/:productId").post(isLoggedIn,customRole("admin"),addProductImage)
// router.route("/admin/products").get(isLoggedIn,customRole("admin"),adminGetAllProduct)
// router.route("/admin/product/:id").put(isLoggedIn,customRole("admin"),adminUpdateOneProduct)
// .delete(isLoggedIn,customRole("admin"),adminDeleteOneProduct)

module.exports = router