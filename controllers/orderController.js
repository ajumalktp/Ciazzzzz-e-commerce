const asyncHandler = require('express-async-handler')


const orderController ={
    getAdminAllOrders: asyncHandler((req,res)=>{
        res.render('admin/orders')
    })
}

module.exports = orderController