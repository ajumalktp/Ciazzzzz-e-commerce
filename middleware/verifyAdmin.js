
const verifyAdmin = async(req,res,next)=>{
    if(req.session.admin){
        console.log();
        next()
    }else{
        res.redirect('/admin/adminLogin')
    }
}

module.exports = verifyAdmin