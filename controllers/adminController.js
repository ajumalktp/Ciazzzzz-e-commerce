const asyncHandler = require('express-async-handler')


const adminController = {
    adminDashboard:asyncHandler((req,res)=>{
        res.render('adminDashboard')
    }),

    adminLogin:asyncHandler((req,res)=>{
        res.render('adminLogin')
    })
}

module.exports = adminController