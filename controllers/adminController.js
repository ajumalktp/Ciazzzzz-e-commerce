const asyncHandler = require('express-async-handler')


const adminController = {
    getadminDashboard:asyncHandler((req,res)=>{
        res.render('adminDashboard')
    }),

    getadminLogin:asyncHandler((req,res)=>{
        res.render('adminLogin')
    })
}

module.exports = adminController