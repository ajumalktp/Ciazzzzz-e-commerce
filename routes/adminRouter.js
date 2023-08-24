const express = require('express')
const router = express.Router()
const {getadminLogin, getadminDashboard, adminLogin, getUsers, adminLogOut, userBan, userUnBan} = require('../controllers/adminController')
const {getAdminProducts,getAddProduct} = require('../controllers/productController')
const {getAllOrders} = require('../controllers/orderController')
const verifyAdmin = require('../middleware/verifyAdmin')

router.get('/',verifyAdmin,getadminDashboard)
router.get('/adminLogin',getadminLogin)
router.get('/products',verifyAdmin,getAdminProducts)
router.get('/users',verifyAdmin,getUsers)
router.get('/orders',verifyAdmin,getAllOrders)
router.get('/logOut',adminLogOut)
router.get('/ban/:_id',verifyAdmin,userBan)
router.get('/unBan/:_id',verifyAdmin,userUnBan)
router.get('/addProduct',getAddProduct)


router.post('/adminLogin',adminLogin)



module.exports = router