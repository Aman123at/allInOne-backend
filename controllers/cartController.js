const Cart = require("../models/cart")
const errorBlock = require("../utils/errorBlock")

exports.addItemsInCart =async(req,res,next)=>{
    try{

        if(!req.body.quantity){
            return errorBlock(res,400,'Product Quantity is required.')
        }
        req.body.user = req.user._id
       const cart = await Cart.create(req.body)
       res.status(200).json({
        success:true,
        cart
       })
    }catch(error){
        res.status(400).json({
            success:false,
            message:error
        })
    }
   
}


exports.getItemsFromCart=async(req,res,next)=>{
    try {
        let cart = await Cart.find({user:req.user})
        if(!cart){
            return errorBlock(res,400,'No cart Items for this user')
        }
        res.status(200).json({
            success:true,
            cart
        })

        
    } catch (error) {
        res.status(400).json({
            success:false,
            message:error
        })
    }
}

exports.removeItemsFromCart=async(req,res,next)=>{
   
        let cartId = req.params.id
        let cart = await Cart.findById(cartId)
        if(!cart){
            return errorBlock(res,404,'Cart not found with this id.')
        }
        Cart.findByIdAndDelete(cartId)
        .then((resp)=>{
            return res.status(200).json({
                success:true
            })
        })
        .catch((e)=>{
            return res.status(400).json({
                success:false,
                message:e
            })
        })


   
}


exports.updateCartItemQuantity=async(req,res,next)=>{
    const cartItemId = req.params.id
    if(cartItemId){
        let cartItem = await Cart.findById(cartItemId)
        if(!cartItem){
            return errorBlock(res,404,'Cart Item not found with this id.')
        }
        let quantity = req.body.quantity
        if(!quantity){
            return errorBlock(res,400,'Product Quantity is required.')
        }
        cartItem.quantity = quantity
        cartItem.save().then((resp)=>{
            return res.status(200).json({
                success:true,
                cartItem:resp
            })
        })
      .catch((e)=>{
        return errorBlock(res,500,"Something went wrong while updating quantity.")
      })
    }else{
        return errorBlock(res,400,'Cart Item Id is required in parameters.')
    }
}

exports.clearCart=async(req,res,next)=>{
    
    let userId = req.params.userId
    Cart.deleteMany({user:userId})
    .then((resp)=>{
        
        return res.status(200).json({
            success:true
        })
    })
    .catch((e)=>{
        return res.status(400).json({
            success:false,
            message:e
        })
    })

    
}