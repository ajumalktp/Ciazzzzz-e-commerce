const express = require('express')
const router = express.Router()
const {getadminLogin, getadminDashboard, adminLogin, getUsers} = require('../controllers/adminController')
const {getProducts} = require('../controllers/productController')
const {getAllOrders} = require('../controllers/orderController')

router.get('/',getadminDashboard)
router.get('/adminLogin',getadminLogin)
router.get('/products',getProducts)
router.get('/users',getUsers)
router.get('/orders',getAllOrders)

router.post('/adminLogin',adminLogin)


module.exports = router