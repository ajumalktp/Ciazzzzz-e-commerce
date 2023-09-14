const asyncHandler = require('express-async-handler')


const orderController ={
    getAdminAllOrders: asyncHandler((req,res)=>{
        res.render('admin/adminOrders')
    })
}

module.exports = orderController