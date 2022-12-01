const errorBlock = require('../utils/errorBlock')
const Razorpay = require('razorpay')
const stripe = require('stripe')(process.env.STRIPE_SECRET)

exports.sendStripeKey = async (req,res,next)=>{
    try {
        
        res.status(200).json({
            stripekey:process.env.STRIPE_API_KEY
        })
    } catch (error) {
        return errorBlock(res,400,error)
    }
}

exports.captureStripePayment = async (req,res,next)=>{
    try {
        
        const paymentIntent = await stripe.paymentIntents.create({
            amount:req.body.amount,
            currency:'inr',
    
            // optional
            metadata:{integration_check:"accept_a_payment"}
        })
        
        res.status(200).json({
            success:true,
            amount:req.body.amount,
            client_secret:paymentIntent.client_secret
        })
    } catch (error) {
        return errorBlock(res,400,error)
    }
}



exports.sendRazorpayKey = async (req,res,next)=>{
    try {
        
        res.status(200).json({
            razorpaykey:process.env.RAZORPAY_API_KEY
        })
    } catch (error) {
        return errorBlock(res,400,error)
    }
}
exports.captureRazorpayPayment = async (req,res,next)=>{
    try {
        
        let instance = new Razorpay({ key_id: process.env.RAZORPAY_API_KEY, key_secret: process.env.RAZORPAY_SECRET })
        let options = {
            amount: 500000,
            currency: "INR",
            receipt: "receipt#5",
           
          }
    const myOrder = await instance.orders.create(options);
    console.log("MyOrder",myOrder)
    res.status(200).json({
        success:true,
        amount:req.body.amount,
        order:myOrder
    })
    } catch (error) {
        return errorBlock(res,400,error)
    }
}