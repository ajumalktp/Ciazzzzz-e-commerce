const userModel = require('../models/userModel')
const productModel = require('../models/productModel')
const orderModel = require('../models/orderModel')
const adminModel = require('../models/adminModel')

const adminController = {

    getDashboard: async (req, res) => {
        const users = await userModel.find().lean()
        const products = await productModel.find().lean()
        const orders = await orderModel.find().lean()
        const monthlyDataArray = await orderModel.aggregate([{ $match: { status: 'Delivered' } }, { $group: { _id: { $month: "$createdAt" }, sum: { $sum: "$totalAmount" } } }])
        let monthlyDataObject = {};
        monthlyDataArray.forEach(item => {
            monthlyDataObject[item._id] = item.sum;
        });

        let monthlyData = [];
        for (let i = 1; i <= 12; i++) {
            monthlyData[i - 1] = monthlyDataObject[i] || 0;
        }
        let totalRevenue = 0
        let totalSales = 0

        let pendingOrders = 0
        let deliveredOrders = 0
        let cancelledOrders = 0
        let returnedOrders = 0

        orders.filter((item) => {
            if (item.status === 'Pending') {
                pendingOrders++
            }
            if (item.status === 'Delivered') {
                deliveredOrders++
                totalRevenue = totalRevenue + item.totalAmount
                totalSales++
            }
            if (item.status === 'Cancelled') {
                cancelledOrders++
            }
            if (item.status === 'Returned') {
                returnedOrders++
            }
        })

        // orders.forEach(item =>{
        //     totalRevenue += item.totalAmount
        // })

        //donut chart
        // const Pending = await orderModel.find({status:'Pending'}).lean()
        // const Delivered = await orderModel.find({status:'Delivered'}).lean()
        // const Cancelled = await orderModel.find({status:'Cancelled'}).lean()
        // const Returned = await orderModel.find({status:'Returned'}).lean()


        if (req.session.admin) {
            res.render('admin/dashboard', { users, products, totalSales, totalRevenue, pendingOrders, deliveredOrders, cancelledOrders, returnedOrders, monthlyData})
        } else {
            res.redirect('/admin/login')
        }
    },

    getLogin: (req, res) => {
        if (req.session.admin) {
            res.redirect('/admin/')
        } else {
            res.render('admin/login')
        }
    },

    login: async (req, res) => {
        const { email, password } = req.body
        const admin = await adminModel.findOne({ email })
        if (admin) {
            if (password == admin.password) {
                req.session.admin = true
                console.log('admin Logined successfully');
                res.redirect('/admin/')
            } else {
                const error = 'invalid Email or Password'
                console.log(error);
                res.render('admin/login', { error })
            }
        } else {
            error = 'admin NOT FOUND'
            console.log(error);
            res.render('admin/login', { error })
        }
    },

    getUsers: async (req, res) => {
        const users = await userModel.find().lean()
        res.render('admin/users', { users })
    },

    userBan: async (req, res) => {
        const _id = req.params.id
        await userModel.findByIdAndUpdate(_id, { $set: { ban: true } })
        req.session.user = null
        res.redirect('/admin/users')
    },

    userUnBan: async (req, res) => {
        const _id = req.params.id
        await userModel.findByIdAndUpdate(_id, { $set: { ban: false } })
        res.redirect('/admin/users')
    },

    logOut: (req, res) => {
        req.session.admin = null
        res.redirect('/admin/login')
    }
};

module.exports = adminController;
