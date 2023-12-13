const User = require("../models/user")
const BigPromise = require("../middlewares/bigPromise")

const jwt = require("jsonwebtoken")

const errorBlock = require("../utils/errorBlock")



exports.isLoggedIn = BigPromise(async (req,res,next)=>{
    const token = req.cookies.token || req.header("Authorization")?.replace("Bearer ","")

    if(!token){
        return errorBlock(res,401,'Login first to access this page.')
        
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    req.user = await User.findById(decoded.id)

    next()
})

exports.customRole = (...roles)=>{
    return(req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return errorBlock(res,403,'You are not allowed for this resource.')
            
        }
        next()
    }
}