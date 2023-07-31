const express = require('express')
const router = express.Router()
const {getHome,getLogin,getSignUp} = require('../controllers/userController')


router.get('/',getHome)
router.get('/login',getLogin)
router.get('/signUp',getSignUp)

module.exports = router