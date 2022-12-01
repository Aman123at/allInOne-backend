const express = require('express');
const { addAddress, getAllAddress, getAddressByUser,deleteAddress } = require('../controllers/addressController');

const { isLoggedIn, customRole } = require('../middlewares/user')
const router = express.Router()




router.route('/address').get(isLoggedIn,customRole('admin'),getAllAddress).post(isLoggedIn,addAddress);
router.route('/address/:userId').get(isLoggedIn,getAddressByUser);
router.route('/address/:id').delete(isLoggedIn,deleteAddress);
// router.route('/cart/:id').delete(isLoggedIn,removeItemsFromCart);

module.exports = router