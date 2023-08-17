const asyncHandler = require("express-async-handler");

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

    adminLogin: asyncHandler((req, res)=>{
        let Uemail = 'admin@gmail.com'
        let Upassword = '1234'
        const {email , password} = req.body
        if(Uemail == email && Upassword == password){
            req.session.admin = true
            res.redirect('/admin')
        }else{
            res.render('adminLogin')
        }
    }),
    getUsers: asyncHandler((req,res)=>{
        res.render('adminUsers')
    })
};

module.exports = adminController;
