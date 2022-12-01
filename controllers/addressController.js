const Address = require('../models/address')
const errorBlock = require("../utils/errorBlock")

exports.addAddress = async(req,res,next)=>{
    try{
        if(!req.body.firstName){
            return errorBlock(res,400,"First name is required")
        }
        if(!req.body.lastName){
            return errorBlock(res,400,"Last name is required")
        }
        if(!req.body.city){
            return errorBlock(res,400,"City is required")
        }
        if(!req.body.country){
            return errorBlock(res,400,"Country is required")
        }
        if(!req.body.state){
            return errorBlock(res,400,"State is required")
        }
        if(!req.body.postalCode){
            return errorBlock(res,400,"Postal code is required")
        }
        if(!req.body.address){
            return errorBlock(res,400,"Address is required")
        }
        if(!req.body.landmark){
            return errorBlock(res,400,"Landmark is required")
        }
        req.body.user = req.user._id

        let address = await Address.create(req.body)
        res.status(200).json({
            success:true,
            address
        })
    }catch(e){
        return errorBlock(res,500,e)
    }
}

exports.getAllAddress=async(req,res,next)=>{
    try {
        let address = await Address.find()
        if(!address){
            return errorBlock(res,404,"No address found.")
        }
        res.status(200).json({
            success:true,
            address
        })
    } catch (error) {
        return errorBlock(res,500,error)
    }
}
exports.getAddressByUser=async(req,res,next)=>{
    try {
        let address = await Address.find({user:req.params.userId})
        if(!address){
            return errorBlock(res,404,"No address found.")
        }
        res.status(200).json({
            success:true,
            address
        })
    } catch (error) {
        return errorBlock(res,500,error)
    }
}

exports.deleteAddress=async(req,res,next)=>{
    try{
        let deleteId = req.params.id
        let address = await Address.findById(deleteId)
        if(!address){
            return errorBlock(res,404,"Address not found.")
        }
        let result = await Address.findByIdAndDelete(deleteId)
        if(!result){
            return errorBlock(res,400,"Unable to delete.")
        }
        res.status(200).json({
            success:true,
            message:"Deleted successfully."
        })

    }catch(err){
        return errorBlock(res,500,err)
    }
}
