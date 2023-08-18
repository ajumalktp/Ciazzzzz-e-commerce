const asyncHandler = require("express-async-handler");
const userModel = require('../models/userModel')
const adminModel = require('../models/adminModel')

const adminController = {

    getadminDashboard: asyncHandler((req, res) => {
        if(req.session.admin){
            res.render('adminDashboard')
        }else{
            res.redirect('/admin/adminLogin')
        }
    }),

    getadminLogin: asyncHandler((req, res) => {
        if(req.session.admin){
            res.redirect('/admin')
        }else{
            res.render('adminLogin')
        }
    }),

    adminLogin: async(req, res)=>{
        const {email , password} = req.body
        const admin = await adminModel.findOne({email})
        if(admin){
            if(password == admin.password){
                req.session.admin = true
                console.log('admin Logined successfully');
                res.redirect('/admin')
            }else{
                const error = 'invalid Email or Password'
                console.log(error);
                res.render('adminLogin',{error})
            }
        }else{
            error = 'admin NOT FOUND'
            console.log(error);
            res.render('adminLogin',{error})
        }
    },

    getUsers: async(req,res)=>{
        const users = await userModel.find().lean()
        res.render('adminUsers',{users})
    },

    adminLogOut: (req,res)=>{
        req.session.admin = null
        res.redirect('/admin/adminLogin')
    }
};

module.exports = adminController;
