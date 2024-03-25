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
const { getAdminBannerSlider, getAdminProductSlider, getBannerSliderAdd, addSlider, getBannerSliderEdit, editSlider, slider_active, slider_inActive, getSliderViewProduct, getProductSliderAdd, getProductSliderEdit } = require('../controllers/bannerController')




router.get('/',verifyAdmin,getDashboard)
router.get('/login',getLogin)
router.get('/products',verifyAdmin,getAdminProducts)
router.get('/users',verifyAdmin,getUsers)
router.get('/orders',verifyAdmin,getAdminAllOrders)
router.get('/logOut',logOut)
router.get('/ban/:id',verifyAdmin,userBan)
router.get('/unBan/:id',verifyAdmin,userUnBan)
router.get('/addProduct',verifyAdmin,getAddProduct)
router.get('/editProduct/:id',verifyAdmin,getEditProduct)
router.get('/product/list/:id',verifyAdmin,Plist)
router.get('/product/unlist/:id',verifyAdmin,Punlist)
router.get('/mainCategory',verifyAdmin,McategoryCount,getMainCategory)
router.get('/subCategory',verifyAdmin,ScategoryCount,getSubCategory)
router.get('/addCategory/main',verifyAdmin,getAddCategoryM)
router.get('/addCategory/sub',verifyAdmin,getAddCategoryS)
router.post('/category/list/:id',verifyAdmin,Clist)
router.post('/category/unlist/:id',verifyAdmin,Cunlist)
router.get('/editCategory/main/:id',verifyAdmin,getEditCategoryM)
router.get('/editCategory/sub/:id',verifyAdmin,getEditCategoryS)



router.post('/login',login)
router.post('/addProduct',verifyAdmin,uploadImage,addProduct,McategoryCount,ScategoryCount)
router.post('/editProduct',verifyAdmin,uploadImage,editProduct)
router.post('/addCategory',verifyAdmin,uploadLogo,addCategory)
router.post('/editCategory',verifyAdmin,uploadLogo,editCategory)


router.get('/dispatch/:id',verifyAdmin,admin_dispatch)
router.get('/shipping/:id',verifyAdmin,admin_shipping)
router.get('/delivered/:id',verifyAdmin,admin_delivered)
router.get('/returning/:id',verifyAdmin,admin_returning)
router.get('/cancell/:id',verifyAdmin,admin_cancell)

router.get('/view-products/:id',verifyAdmin,view_products)


router.get('/bannerSlider',verifyAdmin,getAdminBannerSlider)
router.get('/productSlider',verifyAdmin,getAdminProductSlider)
router.get('/addSlider/bannerSlider',verifyAdmin,getBannerSliderAdd)
router.get('/addSlider/productSlider',verifyAdmin,getProductSliderAdd)
router.get('/editSlider/bannerSlider/:id',verifyAdmin,getBannerSliderEdit)
router.get('/editSlider/productSlider/:id',verifyAdmin,getProductSliderEdit)
router.get('/slider/view-product/:id',verifyAdmin,getSliderViewProduct)

router.post('/addSlider',verifyAdmin,uploadImage,addSlider)
router.post('/editSlider',verifyAdmin,uploadImage,editSlider)
router.post('/slider-active/:id',verifyAdmin,slider_active)
router.post('/slider-inActive/:id',verifyAdmin,slider_inActive)


module.exports = router