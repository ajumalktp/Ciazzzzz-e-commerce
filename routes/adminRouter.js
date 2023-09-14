const express = require('express')
const router = express.Router()
const {getadminLogin, getadminDashboard, adminLogin, getUsers, adminLogOut, userBan, userUnBan} = require('../controllers/adminController')
const {getAdminProducts,getAddProduct,addProduct,getEditProduct,editProduct,Punlist,Plist} = require('../controllers/productController')
const {getAdminAllOrders} = require('../controllers/orderController')
const {getAdminCategory,getAddCategory, addCategory,Clist,Cunlist, getEditCategory, editCategory} = require('../controllers/categoryController')
const verifyAdmin = require('../middleware/verifyAdmin')
const categoryProductCount = require('../middleware/categoryProductCount')

router.get('/',verifyAdmin,getadminDashboard)
router.get('/adminLogin',getadminLogin)
router.get('/products',verifyAdmin,getAdminProducts)
router.get('/users',verifyAdmin,getUsers)
router.get('/orders',verifyAdmin,getAdminAllOrders)
router.get('/logOut',adminLogOut)
router.get('/ban/:id',verifyAdmin,userBan)
router.get('/unBan/:id',verifyAdmin,userUnBan)
router.get('/addProduct',getAddProduct)
router.get('/editProduct/:id',getEditProduct)
router.get('/product/list/:id',Plist)
router.get('/product/unlist/:id',Punlist)
router.get('/category',categoryProductCount,getAdminCategory)
router.get('/addCategory',getAddCategory)
router.get('/category/list/:id',Clist)
router.get('/category/unlist/:id',Cunlist)
router.get('/editCategory/:id',getEditCategory)



router.post('/adminLogin',adminLogin)
router.post('/addProduct',addProduct,categoryProductCount)
router.post('/editProduct',editProduct)
router.post('/addCategory',addCategory)
router.post('/editCategory',editCategory)





module.exports = router