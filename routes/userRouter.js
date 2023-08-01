const express = require('express')
const router = express.Router()
const {getHome,getLogin,getSignUp,signUp} = require('../controllers/userController')


router.get('/',getHome)
router.get('/login',getLogin)
router.get('/signUp',getSignUp)

router.post('/signUp',signUp)

module.exports = router