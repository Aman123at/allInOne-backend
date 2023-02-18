const express = require('express');
const { addItemsInCart, getItemsFromCart, removeItemsFromCart, clearCart } = require('../controllers/cartController');
// const { addCategory, getAllCategory, deleteSubCategories, deleteCategory, updateSubCategory, updateCategory } = require('../controllers/categoryController')
const { isLoggedIn, customRole } = require('../middlewares/user')
const router = express.Router()




router.route('/cart').get(isLoggedIn,getItemsFromCart).post(isLoggedIn,addItemsInCart);
router.route('/cart/:id').delete(isLoggedIn,removeItemsFromCart);
router.route('/cart/clear/:userId').delete(isLoggedIn,clearCart);

module.exports = router