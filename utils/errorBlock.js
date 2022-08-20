const errorBlock = (res,statusCode,message)=>{
    res.status(statusCode).json({
        success:false,
        message:message
    })
}

module.exports = errorBlock