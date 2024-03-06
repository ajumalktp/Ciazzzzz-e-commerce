

const bannerController = {

    getAdminBanners: async(req,res)=>{
        res.render('admin/banners')
    }
}

module.exports = bannerController