
const verifyAdmin = async(req,res,next)=>{
    if(req.session?.admin){
        console.log("admin IN");
        next()
    }else{
        console.log("admin OUT");
        res.redirect('/admin/adminLogin')
    }
}

module.exports = verifyAdmin