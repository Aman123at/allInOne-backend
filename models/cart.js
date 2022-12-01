const mongoose = require('mongoose')

const cartSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:true
    },
    product:{
        name:{
            type:String,
        },
        
        category:{
            type:String
        },
        subCategory:{
            type:String
        },
        price:{
            type:Number,
           
        },
        images:[
            {
                id:{
                    type:String,
                    required:true
                },
                secure_url:{
                    type:String,
                    required:true
                }
            }
            ],
    },

    quantity:{
        type:Number,
        required:true
    }
})

module.exports = mongoose.model('Cart',cartSchema)