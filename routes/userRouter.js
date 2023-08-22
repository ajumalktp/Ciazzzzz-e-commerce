const express = require('express')
const router = express.Router()
const {getHome,getLogin,getUserRegister,userRegister,userLogin,submitOtp,verfiyOtp} = require('../controllers/userController')
const {getShop} = require('../controllers/productController')


router.get('/',getHome)
router.get('/login',getLogin)
router.get('/signUp',getUserRegister)
router.get('/submitOtp',submitOtp)

router.post('/signUp',userRegister)
router.post('/login',userLogin)
router.post('/verfiyOtp',verfiyOtp)

router.get('/shop',getShop)

module.exports = router