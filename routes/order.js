const express = require('express')
const { getAllOrders, getOrderById, createOrder } = require('../controllers/orderController')
const { isLoggedIn } = require('../middlewares/user')

const router = express.Router()


router.route('/orders').get(isLoggedIn,getAllOrders)
router.route('/order/:orderId').get(isLoggedIn,getOrderById)
router.route('/order').post(isLoggedIn,createOrder)

module.exports = router