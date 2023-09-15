const userModel = require('../models/userModel')
const adminModel = require('../models/adminModel')

const adminController = {

    getDashboard:(req, res) => {
        if(req.session.admin){
            res.render('admin/dashboard')
        }else{
            res.redirect('/admin/login')
        }
    },

    getLogin:(req, res) => {
        if(req.session.admin){
            res.redirect('/admin/')
        }else{
            res.render('admin/login')
        }
    },

    login: async(req, res)=>{
        const {email , password} = req.body
        const admin = await adminModel.findOne({email})
        if(admin){
            if(password == admin.password){
                req.session.admin = true
                console.log('admin Logined successfully');
                res.redirect('/admin/')
            }else{
                const error = 'invalid Email or Password'
                console.log(error);
                res.render('admin/login',{error})
            }
        }else{
            error = 'admin NOT FOUND'
            console.log(error);
            res.render('admin/login',{error})
        }
    },

    getUsers: async(req,res)=>{
        const users = await userModel.find().lean()
        res.render('admin/users',{users})
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

    logOut: (req,res)=>{
        req.session.admin = null
        res.redirect('/admin/login')
    }
};

module.exports = adminController;
