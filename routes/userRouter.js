const express = require('express')
const router = express.Router()
const {getHome,getLogin,getUserRegister,userRegister,userLogin,submitOtp,verifyOtp,resendOtp,getProfile,getEmailVerifyFP,emailVerifyFP,verifyOtpFP,changePassFP} = require('../controllers/userController')
const {getShop,getProductDetails,getCart} = require('../controllers/productController')
const verifyUser = require('../middleware/verifyUser')
const { getCategory, getCategoryProducts } = require('../controllers/categoryController')


router.get('/',getHome)
router.get('/login',getLogin)
router.get('/signUp',getUserRegister)
router.get('/submitOtp',submitOtp)
router.get('/resendOtp',resendOtp)
router.get('/profile',verifyUser,getProfile)
router.get('/productDetails/:id',verifyUser,getProductDetails)
router.get('/cart',verifyUser,getCart)
router.get('/category',getCategory)
router.get('/categoryProducts/:id',getCategoryProducts)
router.get('/forgotPass/verifyEmail',getEmailVerifyFP)


router.post('/signUp',userRegister)
router.post('/login',userLogin)
router.post('/verfiyOtp',verifyOtp)
router.post('/forgotPass/verifyEmail',emailVerifyFP)
router.post('/forgotPass/verifyOtp',verifyOtpFP)
router.post('/changePassFP',changePassFP)


router.get('/shop',getShop)

module.exports = router