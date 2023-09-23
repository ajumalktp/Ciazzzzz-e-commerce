const express = require('express')
const router = express.Router()
const {getLogin, getDashboard, login, getUsers, logOut, userBan, userUnBan} = require('../controllers/adminController')
const {getAdminProducts,getAddProduct,addProduct,getEditProduct,editProduct,Punlist,Plist} = require('../controllers/productController')
const {getAdminAllOrders} = require('../controllers/orderController')
const {getMainCategory,getSubCategory,getAddCategoryM,getAddCategoryS, addCategory,Clist,Cunlist, getEditCategoryM,getEditCategoryS, editCategory} = require('../controllers/categoryController')
const verifyAdmin = require('../middleware/verifyAdmin')
const McategoryCount = require('../middleware/McategoryCount')
const ScategoryCount = require('../middleware/ScategoryCount')

router.get('/',verifyAdmin,getDashboard)
router.get('/login',getLogin)
router.get('/products',verifyAdmin,getAdminProducts)
router.get('/users',verifyAdmin,getUsers)
router.get('/orders',verifyAdmin,getAdminAllOrders)
router.get('/logOut',logOut)
router.get('/ban/:id',verifyAdmin,userBan)
router.get('/unBan/:id',verifyAdmin,userUnBan)
router.get('/addProduct',getAddProduct)
router.get('/editProduct/:id',getEditProduct)
router.get('/product/list/:id',Plist)
router.get('/product/unlist/:id',Punlist)
router.get('/mainCategory',McategoryCount,getMainCategory)
router.get('/subCategory',ScategoryCount,getSubCategory)
router.get('/addCategory/main',getAddCategoryM)
router.get('/addCategory/sub',getAddCategoryS)
router.post('/category/list/:id',Clist)
router.post('/category/unlist/:id',Cunlist)
router.get('/editCategory/main/:id',getEditCategoryM)
router.get('/editCategory/sub/:id',getEditCategoryS)



router.post('/login',login)
router.post('/addProduct',addProduct,McategoryCount,ScategoryCount)
router.post('/editProduct',editProduct)
router.post('/addCategory',addCategory)
router.post('/editCategory',editCategory)





module.exports = router