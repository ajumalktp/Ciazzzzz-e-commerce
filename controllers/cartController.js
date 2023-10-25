const cartModel = require('../models/cartModel')
const productModel = require('../models/productModel')

const cartController = {

    getCart: async(req,res)=>{
        const userID = req.session.user.id
        const user = await cartModel.findOne({user:userID}).populate("products").populate("products.product")
        res.render('user/cart',{user})
    },

    addToCart:  async(req,res)=>{
        const prodID = req.params.id
        const userID = req.session.user.id
        
        const product = await productModel.findById(prodID)
        const user = await cartModel.findOne({user:userID})
        const prodExist = await cartModel.findOne({user:userID,'products.product':prodID})
        console.log(prodExist+'hello');
        if(user){
            if(prodExist){
                await cartModel.updateOne({ user: userID, 'products.product': prodID }, {
                    $inc: { 'products.$.quantity': 1,'products.$.price': product.productPrice }
                });
            }else{
                await cartModel.updateOne({user:userID},{
                    $push:{
                        products:{
                            product:prodID,
                            quantity:1,
                            price:product.productPrice
                        }
                    }
                })
                res.json({status:true})
            }
        }else{
            const cart = new cartModel({
                user:userID,
                products:[{
                    product:prodID,
                    quantity:1,
                    price:product.productPrice
            }]
            })
            cart.save()
            res.json({status:true})
        }
    },

    changeQuantity: async(req,res,next)=>{
        const data = req.body
        await cartModel.updateOne({_id:data.cartID, 'products.product': data.prodID }, {
            $inc: { 'products.$.quantity': data.count }
        });
        const product = await cartModel.findOne({ _id: data.cartID, "products._id": data.prod_id },
        { "products.$": 1 },)
        if (product && product.products && product.products.length > 0) {
            const updatedQuantity = product.products[0].quantity;
    
            res.json({ status: true, quantity: updatedQuantity });
            next()
        } else {
            res.json({ status: false, message: 'Product not found in the cart.' });
        }
    },

    changePrice: async(req,res)=>{
        const data = req.body
        const price = parseInt(data.price)*parseInt(data.quantity)
        await cartModel.updateOne({_id:data.cartID, 'products.product': data.prodID }, {
            $set: { 'products.$.price': price }
        });
        const updatedPrice = await cartModel.findOne({ _id: data.cartID, "products._id": data.prod_id },
        { "products.$": 1 },)
        if (updatedPrice && updatedPrice.products && updatedPrice.products.length > 0) {
            const finalPrice = updatedPrice.products[0].price;
            res.json({status:true,updatedPrice:finalPrice})
        } else {
            res.json({ status: false, message: 'Product not found in the cart.' });
        }
    },

    removeItem: async(req,res)=>{
        const userID = req.session.user.id
        const data = req.body
        await cartModel.updateOne({user:userID},{
            $pull:{products:{_id:data.prod_id}}
        })
        const user = await cartModel.findOne({user:userID}).populate("products").populate("products.product")
        res.json({status:true,items:user.products.length})
    },

    emptyCart:(req, res) => {
        const emptyCartContent = `<section style="height: 90vh; display: flex; align-items: center; justify-content: center;"><div class="empty-badge">
        <span style="    font-size: 60px;
        font-family: system-ui;
        font-weight: 800;
        opacity: 0.3;
        " >Empty Cart</span>
        </div>
        </section>`;
        res.send(emptyCartContent);
      },
}

module.exports = cartController