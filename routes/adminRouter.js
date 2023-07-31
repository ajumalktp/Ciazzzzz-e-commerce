const express = require('express')
const router = express.Router()
const {adminLogin, adminDashboard} = require('../controllers/adminController')


router.get('/',adminDashboard)
router.get('/adminLogin',adminLogin)


module.exports = router