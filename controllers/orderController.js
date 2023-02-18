const errorBlock = require('../utils/errorBlock')
const Order = require('../models/order')

exports.createOrder=async(req,res,next)=>{
    try {
        if(!req.body){
            return errorBlock(res,400,"Request is required.")
        }else{
            req.body.user = req.user._id
            let currDate = new Date(Date.now()).toString()
            let expectedDeliveryDate = new Date(Date.now()+(86400000*5)).toString()
            req.body.createdAt = currDate.slice(4,15)
            req.body.expectedDelivery = expectedDeliveryDate.slice(4,15)
            let statusObj = {
                state:'placed',
                description:'Your order is placed.',
                rank:1,
                date:currDate.slice(4,15),
                isCancellable:true,
                isReturnable:false,
                refundPercent:100
            }
            req.body.status = [statusObj]
            const order = await Order.create(req.body)
            res.status(200).json({
                success:true,
                order
            })

        }
        
    } catch (error) {
        return errorBlock(res,500,error)
    }
}

exports.getAllOrders=async(req,res,next)=>{
    try {
        let orders = await Order.find({user:req.user._id})
        res.status(200).json({
            success:true,
            orders
        })
    } catch (error) {
        return errorBlock(res,500,error)
    }
}
exports.getOrderById=async(req,res,next)=>{
    try {
        let order = await Order.findById(req.params.orderId)
        res.status(200).json({
            success:true,
            order
        })
    } catch (error) {
        return errorBlock(res,500,error)
    }
}