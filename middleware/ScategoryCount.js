const productModel = require('../models/productModel')
const categoryModel = require('../models/categoryModel')

const categoryProductCount = async(req,res,next)=>{
    const categories = await categoryModel.find().lean()
        const categoryCounts = await productModel.aggregate([{$match:{unlist:false}},{$group:{_id:'$productSubCategory',count:{$sum:1}}}])
        const categoryCountMap = new Map()
        categoryCounts.forEach((categoryCount)=>{
            const categoryID = categoryCount._id
            const count = categoryCount.count

            const category = categories.find((c) => c._id && categoryID && c._id.toString() === categoryID.toString());

            if (category) {
                const categoryName = category.catName;
                categoryCountMap.set(categoryName, count);
              }
        })
        for(let i = 0; i < categories.length; i++){
            const categoryID = categories[i]._id
            const count = categoryCountMap.get(categories[i].catName)||0;
            await categoryModel.findByIdAndUpdate(categoryID,{$set:{items:count}})
        }
        next()
}

module.exports = categoryProductCount