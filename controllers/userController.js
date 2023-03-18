const User = require('../models/user')


const cookieToken = require('../utils/cookieToken')
const fileUpload = require('express-fileupload')
const cloudinary = require('cloudinary')
// const mailHelper = require('../utils/emailHelper')
const crypto = require('crypto')
const errorBlock = require('../utils/errorBlock')
exports.signup = async (req,res,next)=>{
   
    

    const {name,email,password,gender} = req.body
    const alreadyUser = await User.findOne({email})
    if(alreadyUser){

        return errorBlock(res,400,'Email already exists, please login to continue.')
    }
   
    if(!email || !name || !password || !gender){
      
        return errorBlock(res,400,'Name, email, gender and password are required.')


       
    }
    if(password.length<8){

        return errorBlock(res,400,'Password could not be less than 8 characters.')
    }

    const user = await User.create({
        name,
        email,
        password,
        gender
        // photo:{
        //     id:result.public_id,
        //     secure_url:result.secure_url
        // }
    })

   cookieToken(user,res)
}

exports.getUser = async(req,res,next)=>{
    if(req.user){
        return res.status(200).json({
            success:true,
            user:req.user
        })
    }else{
        res.status(400).json({
            success:false
        })
    }
}

exports.changeViewMode=async(req,res,next)=>{
    let darkmode = req.body.darkmode

    let user = await User.findById(req.user._id)

    if(user){
        User.findByIdAndUpdate(req.user._id,{darkMode:darkmode})
        .then(()=> res.status(200).json({
            success:true,
            user:req.user
        }))
        .catch((e)=>  errorBlock(res,400,'Unable to change mode.'))
    }
    else{
        return errorBlock(res,400,'User not found.')
    }

}


exports.login = async (req,res,next)=>{
    const {email,password} = req.body

   

    if(!email || !password){
        return errorBlock(res,400,'Please provide email and password')
        
    }
    
    const user = await User.findOne({email}).select("+password")
    if(!user){
        return errorBlock(res,400,'Email or password does not match or exist')
        
    }
    
    const isPasswordCorrect = await user.isValidatedPassword(password)
    if(!isPasswordCorrect){
        return errorBlock(res,400,'Password is not correct')
      
    }
    cookieToken(user,res)
}

exports.logout = async (req,res,next)=>{
    res.cookie('token',null,{
        expires:new Date(Date.now()),
        httpOnly:true
    })
    res.status(200).json({
        success:true,
        message:"Logout success."
    })
}


// exports.forgotPassword = BigPromise(async (req,res,next)=>{
//     const {email} = req.body

//     const user = await User.findOne({email})
//     if(!user){
//         return next(new CustomError('Email not found as registerd.',400))
//     }
//     const forgotToken = user.getForgotPasswordToken()
    
//     await user.save({validateBeforeSave:false})

//     const myUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${forgotToken}`

//     const message = `Copy paste this link in your URL and hit enter. \n\n ${myUrl}`

//     try {
//         await mailHelper({
//             email:user.email,
//             subject:"TStore - Password reset email.",
//             message:message
//         })

//         res.status(200).json({
//             success:true,
//             message:"Email sent successfully."
//         })
        
//     } catch (error) {
//         user.forgotPasswordToken=undefined
//         user.forgotPasswordExpiry=undefined
//         await user.save({validateBeforeSave:false})
//         return next(new CustomError(error.message,500))
//     }
// })

// exports.passwordReset = BigPromise(async (req,res,next)=>{
//     const token = req.params.token

//     const encryToken = crypto.createHash('sha256').update(token).digest('hex')

//     const user = await User.findOne({forgotPasswordToken:encryToken,
//         forgotPasswordExpiry:{$gt:Date.now()}
//     })
//     console.log("BEFORE",user)

//     if(!user){
//         return next(new CustomError('Token is invalid or expired.',400))
//     }

//     if(req.body.password !== req.body.confirmPassword){
//         return next(new CustomError('Password and confirm password do not match.',400))
//     }

//     user.password = req.body.password
//     console.log("AFTER",user)

//     user.forgotPasswordToken = undefined
//     user.forgotPasswordExpiry = undefined

//     await user.save({validateBeforeSave:false})

//     cookieToken(user,res)
// })




// exports.changePassword = BigPromise(async (req,res,next)=>{
//     const userId = req.user.id

//     const user = await User.findById(userId).select("+password")
    
//     const isCorrectOldPassword = await user.isValidatedPassword(req.body.oldPassword)

//     if(!isCorrectOldPassword){
//         return next(new CustomError('old password is incorrect.',400))
//     }

//     user.password = req.body.password

//     await user.save()

//     cookieToken(user,res)
   
// })


// exports.updateUserDetails = BigPromise(async (req,res,next)=>{
//     const userId = req.user.id
//     if(!req.body.name || !req.body.email){
//         return next(new CustomError('Email and name both required.',400))
//     }

//     const newData = {
//         name:req.body.name,
//         email:req.body.email
//     }

//     if(req.files && req.files.photo !== ''){
//         const user = await User.findById(userId)
//         const imageId = user.photo.id
//         // delete photo in cloudinary
//         const resp = await cloudinary.v2.uploader.destroy(imageId)
//         // upload the new photo
//         let file = req.files.photo
//         const result = await cloudinary.v2.uploader.upload(file.tempFilePath,{
//             folder:"users",
//             width:150,
//             crop:'scale'
//         })

//         newData.photo = {
//             id:result.public_id,
//             secure_url:result.secure_url
//         }
//     }
//     const user = await User.findByIdAndUpdate(userId,newData,{
//         new:true,
//         runValidators:true,
//         useFindAndModify:false
//     })

//     res.status(200).json({
//         success:true
//     })
    
    
   
// })











