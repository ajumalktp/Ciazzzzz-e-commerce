const asyncHandler = require('express-async-handler')


const orderController ={
    getAllOrders: asyncHandler((req,res)=>{
        res.render('adminOrders')
    })
}

module.exports = orderController