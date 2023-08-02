const express = require('express')
const router = express.Router()
const {getadminLogin, getadminDashboard} = require('../controllers/adminController')


router.get('/',getadminDashboard)
router.get('/adminLogin',getadminLogin)


module.exports = router