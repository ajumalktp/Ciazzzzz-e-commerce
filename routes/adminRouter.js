const express = require('express')
const router = express.Router()
const {getadminLogin, getadminDashboard, adminLogin} = require('../controllers/adminController')


router.get('/',getadminDashboard)
router.get('/adminLogin',getadminLogin)

router.post('/adminLogin',adminLogin)


module.exports = router