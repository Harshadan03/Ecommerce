const express = require('express')
const router = express.Router()

const { requireSignIn, isAuth, isAdmin } = require('../controllers/auth')
const { userById, addOrderToUserHistory } = require('../controllers/user')
const { createOrder, listOfOrders, getStatusValues, orderById, updateOrderStatus } = require('../controllers/order')
const { decreaseQuantityAndIncreaseSold } = require('../controllers/product')

// api to create a order and when order is created check 
// authentication using requiresignin and isAuth middlewares
// and add that order to users history using middleware addOrderToUserHistory
// and decrese the quantity avilable and increase sold items for those products 
// using middleware decreaseQuantityAndIncreaseSold
router.post('/order/create/:userId',
    requireSignIn, isAuth, addOrderToUserHistory, decreaseQuantityAndIncreaseSold, createOrder)

// api to get all the orders so that admin can update their status 
router.get('/order/list/:userId', requireSignIn, isAuth, isAdmin, listOfOrders)

// get the enum values from orer schema
router.get('/order/status-values/:userId', requireSignIn, isAuth, isAdmin, getStatusValues)


//update order( i.e. order status)
router.put('/order/:orderId/status/:userId', requireSignIn, isAuth, isAdmin, updateOrderStatus)

router.param("userId", userById)
router.param("orderId", orderById)

module.exports = router