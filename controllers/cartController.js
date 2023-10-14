const cartModel = require('../models/cartModel')

const cartController = {

    getCart: async(req,res)=>{
        const userID = req.session.user.id
        const user = await cartModel.findOne({user:userID}).populate("products")
        res.render('user/cart',{user})
    },

    addToCart:  async(req,res)=>{
        const prodID = req.params.id
        const userID = req.session.user.id
        const route = req.body.route

        const user = await cartModel.findOne({user:userID})
        console.log(user);
        if(user){
            await cartModel.updateOne({user:userID},{
                $push:{products:prodID}
            })
            res.redirect(route)
        }else{
            const cart = new cartModel({
                user:userID,
                products:prodID
            })
            cart.save()
            res.redirect(route)
        }
    },
}

module.exports = cartController