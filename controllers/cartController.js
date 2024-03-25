const cartModel = require('../models/cartModel')
const productModel = require('../models/productModel')
const userModel = require('../models/userModel')

const cartController = {

    getCart: async(req,res)=>{
        const userID = req.session.user.id
        const user = await userModel.findOne({_id:userID})
        const cart = await cartModel.findOne({user:userID}).populate("products.product")
        if(user.wallet <= 0 ){
            await cartModel.findByIdAndUpdate(cart._id,{
              $set:{
                wallet:false
              }
            })
          }
        res.render('user/cart',{cart})
    },

    addToCart:  async(req,res)=>{
        const prodID = req.params.id
        const userID = req.session.user.id
        let cartID = req.session.user.cartID
        const cart = await cartModel.findOne({user:userID})
        if(!cart){
            const newCart = new cartModel({
                user:userID,
                method:'cart',
            })
            newCart.save()
            cartID = newCart._id,''
            req.session.user.cartID = newCart._id,''
        }

        const product = await productModel.findById(prodID)
        const user = await cartModel.findOne({_id:cartID})
        const prodExist = await cartModel.findOne({_id:cartID,'products.product':prodID},{ "products.$": 1 }).populate('products.product')
        if(user){
            if(prodExist){
                if(prodExist.products[0].quantity < prodExist.products[0].product.productQuantity){
                await cartModel.updateOne({ _id:cartID, 'products.product': prodID }, {
                    $inc: { 'products.$.quantity': 1,'products.$.price': product.productPrice }
                });
                res.json({change:true,cartID:cartID})
                }
            }else{
                await cartModel.updateOne({_id:cartID},{
                    $push:{
                        products:{
                            product:prodID,
                            quantity:1,
                            price:product.productPrice
                        }
                    },
                })
                res.json({status:true,change:true,cartID:cartID})
            }
        }else{
            await cartModel.findByIdAndUpdate(cartID,{
                $set:{
                    products:[{
                        product:prodID,
                        quantity:1,
                        price:product.productPrice
                    }],
                }
            })
            res.json({status:true,change:true,cartID:cartID})
        }
    },

    changeQuantity: async(req,res,next)=>{
        const data = req.body
        console.log(req.body);
        const cart = await cartModel.findOne({_id:data.cartID,'products._id':data.prod_id}).populate("products.product")
        console.log(cart);
        function counting(cart,prodID){
        for(let i = 0; i < cart.products.length; i++){
            if(cart.products[i].product._id == prodID){
                return i
            }
        }
        }
        let item = counting(cart,data.prodID)
        console.log(item);

            if(data.count == 1){
                if(cart.products[item].quantity < cart.products[item].product.productQuantity){
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
                }else{
                    const product = await cartModel.findOne({ _id: data.cartID, "products._id": data.prod_id },
                    { "products.$": 1 },)
                    if (product && product.products && product.products.length > 0) {
                        const updatedQuantity = product.products[0].quantity;
                        res.json({status:false,quantity: updatedQuantity})
                    }
                }
            }else{
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
        console.log(req.body);
        await cartModel.updateOne({_id:data.cartID},{
            $pull:{products:{_id:data.prod_id}}
        })
        const user = await cartModel.findOne({_id:data.cartID}).populate("products").populate("products.product")
        console.log(user);
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

      totalPrice: async(req,res)=>{
        const cartID = req.body.cartID
        let sum = 0
        const user = await cartModel.findOne({_id:cartID}).populate("products")
        for(i = 0; i < user.products.length; i++){
            sum = sum + user.products[i].price
        }
        await cartModel.updateOne({_id:cartID},{
            $set:{totalPrice:sum}
        })
        res.json({status:true,totalPrice:sum})
      },
}

module.exports = cartController