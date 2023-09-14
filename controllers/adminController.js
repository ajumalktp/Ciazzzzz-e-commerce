const userModel = require('../models/userModel')
const adminModel = require('../models/adminModel')

const adminController = {

    getadminDashboard:(req, res) => {
        if(req.session.admin){
            res.render('admin/adminDashboard')
        }else{
            res.redirect('/admin/adminLogin')
        }
    },

    getadminLogin:(req, res) => {
        if(req.session.admin){
            res.redirect('/admin')
        }else{
            res.render('admin/adminLogin')
        }
    },

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
                res.render('admin/adminLogin',{error})
            }
        }else{
            error = 'admin NOT FOUND'
            console.log(error);
            res.render('admin/adminLogin',{error})
        }
    },

    getUsers: async(req,res)=>{
        const users = await userModel.find().lean()
        res.render('admin/adminUsers',{users})
    },

    userBan: async(req,res)=>{
        const _id = req.params.id
        await userModel.findByIdAndUpdate(_id,{$set:{ban:true}})
        req.session.user = null
        res.redirect('/admin/users')
    },

    userUnBan: async(req,res)=>{
        const _id = req.params.id
        await userModel.findByIdAndUpdate(_id,{$set:{ban:false}})
        res.redirect('/admin/users')
    },

    adminLogOut: (req,res)=>{
        req.session.admin = null
        res.redirect('/admin/adminLogin')
    }
};

module.exports = adminController;
