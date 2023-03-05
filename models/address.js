const mongoose = require('mongoose')


const addressSchema = new mongoose.Schema({
    firstName:{
        type:String
    },
    phone:{
        type:Number
    },
   
    lastName:{
        type:String
    },
    address:{
        type:String
    },
    landmark:{
        type:String
    },
    city:{
        type:String
    },
    country:{
        type:String
    },
    state:{
        type:String
    },
    postalCode:{
        type:String
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:true
    },
    type:{
        type:String
    },
    otherTypeVal:{
        type:String
    },
    isDefaultAddress:{
        type:Boolean
    }
})

module.exports = mongoose.model('Address',addressSchema)

