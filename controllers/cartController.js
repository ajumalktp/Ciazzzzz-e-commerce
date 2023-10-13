const cartModel = require('../models/cartModel')

const cartController = {

    addToCart:  async(req,res)=>{
        const prodID = req.params.id
        const userID = req.session.user.id

        const user = await cartModel.findOne({user:userID})
        console.log(user);
        if(user){
            await cartModel.updateOne({user:userID},{
                $push:{products:prodID}
            })
            console.log("hello");
        }else{
            const cart = new cartModel({
                user:userID,
                products:prodID
            })
            console.log(cart);
            cart.save()
            console.log("product added to cart");
        }
    },
}

module.exports = cartController