const express = require('express')
const router = express.Router()
const {getadminLogin, getadminDashboard, adminLogin, getUsers, adminLogOut, userBan, userUnBan} = require('../controllers/adminController')
const {getAdminProducts,getAddProduct,addProduct,getEditProduct,editProduct,list,unlist} = require('../controllers/productController')
const {getAllOrders} = require('../controllers/orderController')
const verifyAdmin = require('../middleware/verifyAdmin')

router.get('/',verifyAdmin,getadminDashboard)
router.get('/adminLogin',getadminLogin)
router.get('/products',verifyAdmin,getAdminProducts)
router.get('/users',verifyAdmin,getUsers)
router.get('/orders',verifyAdmin,getAllOrders)
router.get('/logOut',adminLogOut)
router.get('/ban/:id',verifyAdmin,userBan)
router.get('/unBan/:id',verifyAdmin,userUnBan)
router.get('/addProduct',getAddProduct)
router.get('/editProduct/:id',getEditProduct)
router.get('/list/:id',list)
router.get('/unlist/:id',unlist)



router.post('/adminLogin',adminLogin)
router.post('/addProduct',addProduct)
router.post('/editProduct',editProduct)





module.exports = router