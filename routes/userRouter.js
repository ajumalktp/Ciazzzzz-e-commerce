const express = require('express')
const router = express.Router()
const {getHome,getLogin,getUserRegister,userRegister,userLogin,submitOtp,verifyOtp,resendOtp,getProfile,getEmailVerifyFP,emailVerifyFP,verifyOtpFP,changePassFP,getAddAddress,submitAddress, getEditAddress, editAddress, deleteAddress, getEditInfo, editInfo} = require('../controllers/userController')
const {getShop,getProductDetails} = require('../controllers/productController')
const verifyUser = require('../middleware/verifyUser')
const { getCategory, getCategoryProducts } = require('../controllers/categoryController')
const { addToCart,getCart,changeQuantity,changePrice,removeItem,emptyCart,totalPrice } = require('../controllers/cartController')
const { getCheckOut, COD_order ,ONLINE_order} = require('../controllers/orderController')


router.get('/',getHome)
router.get('/login',getLogin)
router.get('/signUp',getUserRegister)
router.get('/submitOtp',submitOtp)
router.get('/resendOtp',resendOtp)
router.get('/profile',verifyUser,getProfile)
router.get('/productDetails/:id',verifyUser,getProductDetails)
router.get('/category',getCategory)
router.get('/categoryProducts/:id',getCategoryProducts)
router.get('/forgotPass/verifyEmail',getEmailVerifyFP)

router.get('/add-address',verifyUser,getAddAddress)
router.post('/add-address',submitAddress)
router.get('/edit-address/:id',getEditAddress)
router.post('/edit-address/:id',editAddress)
router.post('/delete-address/:id',deleteAddress)

router.get('/edit-info',getEditInfo)
router.post('/edit-info',editInfo)

router.post('/COD_order',COD_order)
router.post('/ONLINE_order',ONLINE_order)

router.post('/signUp',userRegister)
router.post('/login',userLogin)
router.post('/verfiyOtp',verifyOtp)
router.post('/forgotPass/verifyEmail',emailVerifyFP)
router.post('/forgotPass/verifyOtp',verifyOtpFP)
router.post('/changePassFP',changePassFP)


router.get('/shop',getShop)


router.get('/cart',verifyUser,getCart)

router.get('/add-to-cart/:id',addToCart)
router.get('/emptyCart',emptyCart)


router.post('/changeQuantity',changeQuantity)
router.post('/changePrice',changePrice)
router.post('/removeItem',removeItem)
router.post('/get-totalPrice',totalPrice)

router.get('/checkout',verifyUser,getCheckOut)

module.exports = router