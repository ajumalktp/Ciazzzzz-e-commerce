const express = require('express')
const router = express.Router()
const {getHome,getLogin,getUserRegister,userRegister,userLogin,submitOtp,verifyOtp,resendOtp,getProfile} = require('../controllers/userController')
const {getShop,getProductDetails,getCart} = require('../controllers/productController')
const verifyUser = require('../middleware/verifyUser')


router.get('/',getHome)
router.get('/login',getLogin)
router.get('/signUp',getUserRegister)
router.get('/submitOtp',submitOtp)
router.get('/resendOtp',resendOtp)
router.get('/profile',verifyUser,getProfile)
router.get('/productDetails/:id',verifyUser,getProductDetails)
router.get('/cart',verifyUser,getCart)


router.post('/signUp',userRegister)
router.post('/login',userLogin)
router.post('/verfiyOtp',verifyOtp)


router.get('/shop',verifyUser,getShop)

module.exports = router