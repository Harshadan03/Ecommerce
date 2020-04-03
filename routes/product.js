const express = require('express')
const router = express.Router()

//import  category controller
const { createProduct, productById, readProduct, removeProduct,
    updateProduct, listOfProducts, listRelatedProducts, listCategories, listBySearch, productPhoto, listSearch }
    = require('../controllers/product')
//import middleware to ensure category only accessed by admin
const { isAdmin, isAuth, requireSignIn } = require('../controllers/auth')
const { userById } = require('../controllers/user')


router.post('/product/create/:userId', requireSignIn, isAuth, isAdmin, createProduct)
router.get('/product/:productId', readProduct)
router.delete('/product/:productId/:userId', requireSignIn, isAuth, isAdmin, removeProduct)
router.put('/product/:productId/:userId', requireSignIn, isAuth, isAdmin, updateProduct)
//get all products
router.get('/products', listOfProducts)
//api for search bar on home page of front end 
router.get("/products/search", listSearch)
//get realted products
router.get('/products/related/:productId', listRelatedProducts)
//get product categories
router.get('/products/categories', listCategories)
// route - make sure its post
router.post("/products/by/search", listBySearch)
//send product photo
router.get('/product/photo/:productId', productPhoto)


router.param("userId", userById)
router.param("productId", productById)

module.exports = router 