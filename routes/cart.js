const express = require('express');
const { addItemsInCart, getItemsFromCart, removeItemsFromCart } = require('../controllers/cartController');
// const { addCategory, getAllCategory, deleteSubCategories, deleteCategory, updateSubCategory, updateCategory } = require('../controllers/categoryController')
const { isLoggedIn, customRole } = require('../middlewares/user')
const router = express.Router()




router.route('/cart').get(isLoggedIn,getItemsFromCart).post(isLoggedIn,addItemsInCart);
router.route('/cart/:id').delete(isLoggedIn,removeItemsFromCart);

module.exports = router