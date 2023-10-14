

const orderController = {

    getAdminAllOrders: (req,res)=>{
        res.render('admin/orders')
    },

    getCheckOut: (req,res)=>{
        res.render('user/checkout')
    },

}

module.exports = orderController