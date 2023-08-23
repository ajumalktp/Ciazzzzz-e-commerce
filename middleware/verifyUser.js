const userModel = require('../models/userModel')

const verifyUser = async(req,res,next)=>{
    if(req.session.user){
        const user = await userModel.findOne({_id:req.session.user.id,ban:false},{password:0})
        if(user){
            req.session.user.id = user._id
            console.log("not banned");
            next()
        }else{
            console.log("banned");
            res.redirect('/login');
        }
    }else{
        console.log("no session");
        res.redirect('/login')
    }
}

module.exports = verifyUser