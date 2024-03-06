const express = require('express')
const router = express.Router()
const {getLogin, getDashboard, login, getUsers, logOut, userBan, userUnBan} = require('../controllers/adminController')
const {getAdminProducts,getAddProduct,addProduct,getEditProduct,editProduct,Punlist,Plist} = require('../controllers/productController')

const {getAdminAllOrders, admin_dispatch, admin_shipping, admin_delivered, admin_returning, admin_cancell, view_products} = require('../controllers/orderController')
const {getMainCategory,getSubCategory,getAddCategoryM,getAddCategoryS, addCategory,Clist,Cunlist, getEditCategoryM,getEditCategoryS, editCategory} = require('../controllers/categoryController')
const verifyAdmin = require('../middleware/verifyAdmin')
const McategoryCount = require('../middleware/McategoryCount')
const ScategoryCount = require('../middleware/ScategoryCount')
const {uploadImage,uploadLogo} = require('../middleware/multer')
const { getAdminBanners } = require('../controllers/bannerController')




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
router.post('/addProduct',uploadImage,addProduct,McategoryCount,ScategoryCount)
router.post('/editProduct',uploadImage,editProduct)
router.post('/addCategory',uploadLogo,addCategory)
router.post('/editCategory',uploadLogo,editCategory)


router.get('/dispatch/:id',admin_dispatch)
router.get('/shipping/:id',admin_shipping)
router.get('/delivered/:id',admin_delivered)
router.get('/returning/:id',admin_returning)
router.get('/cancell/:id',admin_cancell)

router.get('/view-products/:id',view_products)


router.get('/banners',getAdminBanners)


module.exports = router