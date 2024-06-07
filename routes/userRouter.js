const express = require('express')
const router = express.Router()
const {getHome,getLogin,getUserRegister,userRegister,userLogin,submitOtp,verifyOtp,resendOtp,getProfile,getEmailVerifyFP,emailVerifyFP,verifyOtpFP,changePassFP,getAddAddress,submitAddress, getEditAddress, editAddress, deleteAddress, getEditInfo, editInfo, getChangePassword, changePassword, logOut} = require('../controllers/userController')
const {getShop,getProductDetails} = require('../controllers/productController')
const verifyUser = require('../middleware/verifyUser')
const { getCategory, getCategoryProducts } = require('../controllers/categoryController')
const { addToCart,getCart,changeQuantity,changePrice,removeItem,emptyCart,totalPrice } = require('../controllers/cartController')
const { getCheckOut, place_order , allOrders, delivered, cancelled, ONLINE, returned, COD, order_success,verifyPayment, returning_order, cancel_order, repayment, buyNow, wallet_deny, wallet_apply,view_products} = require('../controllers/orderController')


router.get('/',getHome)
router.get('/login',getLogin)
router.get('/logOut',verifyUser,logOut)
router.get('/signUp',getUserRegister)
router.get('/submitOtp',submitOtp)
router.get('/resendOtp',resendOtp)
router.get('/profile',verifyUser,getProfile)
router.get('/productDetails/:id',getProductDetails)
router.get('/category',getCategory)
router.get('/categoryProducts/:id',getCategoryProducts)
router.get('/forgotPass/verifyEmail',getEmailVerifyFP)

router.get('/add-address',verifyUser,getAddAddress)
router.post('/add-address',verifyUser,submitAddress)
router.get('/edit-address/:id',verifyUser,getEditAddress)
router.post('/edit-address/:id',verifyUser,editAddress)
router.post('/delete-address/:id',verifyUser,deleteAddress)

router.get('/edit-info',verifyUser,getEditInfo)
router.post('/edit-info',verifyUser,editInfo)
router.get('/changePassword',verifyUser,getChangePassword)
router.post('/changePassword',verifyUser,changePassword)

router.post('/place_order',verifyUser,place_order)
router.get('/order-success',verifyUser,order_success)
router.post('/verifyPayment',verifyUser,verifyPayment)
router.post('/repayment',verifyUser,repayment)

router.post('/signUp',userRegister)
router.post('/login',userLogin)
router.post('/verfiyOtp',verifyOtp)
router.post('/forgotPass/verifyEmail',emailVerifyFP)
router.post('/forgotPass/verifyOtp',verifyOtpFP)
router.post('/changePassFP',changePassFP)


router.get('/shop',getShop)
router.get('/myOrders/allOrders',verifyUser,allOrders)
router.get('/myOrders/delivered',verifyUser,delivered)
router.get('/myOrders/cancelled',verifyUser,cancelled)
router.get('/myOrders/returned',verifyUser,returned)
router.get('/myOrders/COD',verifyUser,COD)
router.get('/myOrders/ONLINE',verifyUser,ONLINE)


router.get('/cart',verifyUser,getCart)

router.get('/add-to-cart/:id',verifyUser,addToCart)
router.get('/emptyCart',verifyUser,emptyCart)


router.post('/changeQuantity',verifyUser,changeQuantity)
router.post('/changePrice',verifyUser,changePrice)
router.post('/removeItem',verifyUser,removeItem)
router.post('/get-totalPrice',verifyUser,totalPrice)

router.get('/checkout/:id',verifyUser,getCheckOut)
router.get('/wallet/deny/:id',verifyUser,wallet_deny)
router.get('/wallet/apply/:id',verifyUser,wallet_apply)


router.post('/return-order/:id',verifyUser,returning_order)
router.post('/cancel-order/:id',verifyUser,cancel_order)

router.get('/buyNow/:id',verifyUser,buyNow)

router.get('/view-product/:id',verifyUser,view_products)

module.exports = router