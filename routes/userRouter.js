const express = require('express')
const router = express.Router()
const {getHome,getLogin,getSignUp,signUp} = require('../controllers/userController')
const {getShop} = require('../controllers/productController')


router.get('/',getHome)
router.get('/login',getLogin)
router.get('/signUp',getSignUp)

router.post('/signUp',signUp)


router.get('/shop',getShop)

module.exports = router