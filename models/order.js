const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true
    },
    order_id:{
        type:String
    },
    
    payment_id:{
        type:String
    },
   
    products:[
        {
            productId:{
                type:String
            },
            productName:{
                type:String,
            },
            productPrice:{
                type:String,
            },
            quantity:{
                type:Number
            }
        }
    ],
    
    
    status:[
        {
            state:{
                type:String,
                // enum : ['placed','accepted','ready-to-ship','shipped','out-for-delivery','delivered'],
                // default:'placed'
            },
            description:{
                type:String,
                // default:"Your order is placed."
            },
            rank:{
                type:Number,
                // default:1
            },
            date:{
                type:String,
                
            },
            isCancellable:{
                type:Boolean,
                // default:true
            },
            isReturnable:{
                type:Boolean,
                // default:false
            },
            refundPercent:{
                type:Number,
                // default:100
            }
        }
    ],
    createdAt:{
        type:String,
        
    },
    expectedDelivery:{
        type:String,
    }
    
})

module.exports = mongoose.model("Order",orderSchema)