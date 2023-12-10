const Product = require('../models/product')
const cloudinary = require('cloudinary')
const errorBlock = require('../utils/errorBlock')
let ObjectID = require('mongodb').ObjectID;





exports.addProduct = async (req,res,next)=>{
    let imageArray = []
    console.log(req.body)
    console.log(req.files)
    if(!req.files){
        return errorBlock(res,401,'images are required')
        
    }

    if(req.files){
        if(req.files.images.length){

            for (let index = 0; index < req.files.images.length; index++) {
                let result = await cloudinary.v2.uploader.upload(req.files.images[index].tempFilePath,{
                    folder:"products"
                })
    
                imageArray.push({
                    id:result.public_id,
                    secure_url:result.secure_url
                })
                
            }
        }else{
            let result = await cloudinary.v2.uploader.upload(req.files.images.tempFilePath,{
                folder:"products"
            })

            imageArray.push({
                id:result.public_id,
                secure_url:result.secure_url
            })
        }
    }

    req.body.images = imageArray
    req.body.user = req.user.id

    const product = await Product.create(req.body)

    res.status(200).json({
        success:true,
        product
    })
}
exports.addProductBulk = async (req,res,next)=>{
    
    const {data} = req.body
   

    let requestData = data.map((prod)=>{
        prod.user = req.user.id
        prod.price= prod.price*82
        return prod
    })
    // req.body.user = req.user.id

    const product = await Product.insertMany(requestData)

    res.status(200).json({
        success:true,
        product,
        total:requestData.length
    })
}



exports.searchProduct = async (req,res,next)=>{
    const {keyword,subcat,priceRange} = req.query;
    let findQuery = {}
    if(!keyword){
        return errorBlock(res,404,'No product found with this keyword.')
    }
    if (subcat && priceRange){
        // if both present
        findQuery = {subCategory:subcat,price:{$lte:priceRange},name:{$regex: new RegExp(keyword, 'i')}} 
    }else if (subcat){
        // if only subcat activated
        findQuery = {subCategory:subcat,name:{$regex: new RegExp(keyword, 'i')}}
    }else if (priceRange){
        // if only price range activated
        findQuery = {price:{$lte:priceRange},name:{$regex: new RegExp(keyword, 'i')}}
    }else{
        // if no filter activated
        // findQuery = {name:keyword}
        findQuery = {name:{$regex: new RegExp(keyword, 'i')}}
    }

    if (Object.keys(findQuery).length>0){
        const product = await Product.find(findQuery)
      
        return res.status(200).json({ 
            success:true,
            product,
                
        })
        
    }else{
        return errorBlock(res,404,'No query found.')
    }
    
}



exports.getAllProduct = async (req,res,next)=>{
    const products = await Product.find()
    
    res.status(200).json({
        success:true,
        products,
      
    })
}

exports.getOneProduct = async (req,res,next)=>{
    const product = await Product.findById(req.params.id)
    if(!product){
        return errorBlock(res,401,'No product found with this id.')
        
    }
    res.status(200).json({ 
        success:true,
        product,
        
    })
}


exports.getProductsInBatches = async (req,res,next)=>{
    const {batchSize,currentPage} = req.query 
    const {subCategory} = req.body
    if(!batchSize || !currentPage){
        return errorBlock(res,401,'No product found.')
        
    }
    const skipAmount =( currentPage - 1 ) * batchSize;
    const product = await Product.find(subCategory ? {subCategory}:{}).skip(parseInt(skipAmount)).limit(parseInt(batchSize)).exec()

    res.status(200).json({ 
        success:true,
        subCategory:subCategory?subCategory:"",
        isSubCat:subCategory?true:false,
        count:product?product.length:0 ,
        product,
        
    })
}


exports.getProductBySubcategory = async (req,res,next)=>{
    
    const products = await Product.find({subCategory:req.body.subCategory})
    if(!products){
        return errorBlock(res,401,'No product found with this subCategory.')
        
    }
    res.status(200).json({ 
        success:true,
        products,
        
    })
}


// exports.adminUpdateOneProduct = BigPromise(async (req,res,next)=>{
//     let product = await Product.findById(req.params.id)
//     if(!product){
//         return next(new CustomError('No product found with this id.',401))
//     }
//     let imageArray = []
    
//     if(req.files){
//         // destroy the existing image
//         for (let index = 0; index < product.photos.length; index++) {
//             await cloudinary.v2.uploader.destroy(product.photos[index].id)
            
//         }

//         // upload and save the images

//         for (let index = 0; index < req.files.photos.length; index++) {
//             let result = await cloudinary.v2.uploader.upload(req.files.photos[index].tempFilePath,{
//                 folder:"products"
//             })

//             imageArray.push({
//                 id:result.public_id,
//                 secure_url:result.secure_url
//             })
            
//         }
//     }

//     req.body.photos = imageArray
//     product = await Product.findByIdAndUpdate(req.params.id,req.body,{
//         new:true,
//         runValidators:true,
//         useFindAndModify:false
//     })
//     res.status(200).json({
//         success:true,
//         product,
        
//     })
// })
exports.adminDeleteProduct = async (req,res,next)=>{
    let product = await Product.findById(req.params.id)
    if(!product){
        
        return errorBlock(res,404,'No product found with this id.')
    }
    // destroy the existing image
    for (let index = 0; index < product.images.length; index++) {
        await cloudinary.v2.uploader.destroy(product.images[index].id)
        
    }

    await product.remove()

    res.status(200).json({
        success:true,
       message:"Product deleted Successfully."
        
    })
}
exports.removeProductImage = async (req,res,next)=>{
    let product = await Product.findById(req.params.productId)
    let imagesArray = product.images
    console.log("BEFORE",imagesArray)
    if(!product){
        
        return errorBlock(res,404,'No product found with this id.')
    }
    // destroy the existing image
    for (let index = 0; index < req.body.images.length; index++) {
        await cloudinary.v2.uploader.destroy(req.body.images[index])
        imagesArray = imagesArray.filter((val)=>val.id.toString() !== req.body.images[index])
    }

    // await product.remove()
   
    console.log("AFTER",imagesArray)
    Product.findByIdAndUpdate(req.params.productId,{images:imagesArray})
    .then(()=>
     res.status(200).json({
        success:true,
       message:"Images deleted Successfully."
        
    })
    )
    .catch((e)=>
    {res.status(400).json({
        success:false,
       message:"Something wrong while deleting images."
        
    })}
    )
}
exports.addProductImage = async (req,res,next)=>{
    let product = await Product.findById(req.params.productId)
    if(!product){
        
        return errorBlock(res,404,'No product found with this id.')
    }
    let imageArray =[]
     if(product.images){
        product.images.map((val)=>{
            imageArray.push(val)
        })
     }
  
    console.log(req.files.images.length)
    if(!req.files){
        return errorBlock(res,401,'images are required')
        
    }

    if(req.files){
        if(req.files.images.length){

            for (let index = 0; index < req.files.images.length; index++) {
                let result = await cloudinary.v2.uploader.upload(req.files.images[index].tempFilePath,{
                    folder:"products"
                })
    
                imageArray.push({
                    id:result.public_id,
                    secure_url:result.secure_url,
                    _id:new ObjectID()
                })
                
            }
        }else{
            let result = await cloudinary.v2.uploader.upload(req.files.images.tempFilePath,{
                folder:"products"
            })

            imageArray.push({
                id:result.public_id,
                secure_url:result.secure_url,
                _id:new ObjectID()
            })
        }
    }

    console.log("ImagesArray",imageArray)
    product.images = imageArray
    Product.findByIdAndUpdate(req.params.id,product)
    .then(()=>
    res.status(200).json({
        success:true,
        product
    })
    )
    .catch((e)=>
    
    res.status(400).json({
        success:false,
        message:"Something wrong while adding images."
    })
    )

}


exports.updateProduct = async(req,res,next)=>{
    let product = await Product.findById(req.params.productId)
    if(!product){
        
        return errorBlock(res,404,'No product found with this id.')
    }
    Product.findByIdAndUpdate(req.params.productId,req.body)
    .then(()=>
    res.status(200).json({
        success:true,
       
    })
    )
    .catch((e)=>
    
    res.status(400).json({
        success:false,
        message:"Something wrong while updating."
    })
    )



}
// exports.addReview = BigPromise(async (req,res,next)=>{
//    const {rating,comment,productId} = req.body
//    const review = {
//        user:req.user._id,
//        name:req.user.name,
//        rating:Number(rating),
//        comment
//    }

//    const product = await Product.findById(productId)

//    const AlreadyReview = product.reviews.find(
//        (rev)=>rev.user.toString() == req.user._id.toString()
//    )

//    if(AlreadyReview){
//     product.reviews.forEach((review)=>{
//         if(review.user.toString() == req.user._id.toString()){
//             review.comment = comment
//             review.rating = rating

//         }

//     })
//    }else{
//        product.reviews.push(review)
//        product.numberOfReviews = product.reviews.length
//    }

//    // adjust ratings
//    product.ratings = product.reviews.reduce((acc,item)=>item.rating + acc,0)/product.reviews.length

//    // save
//    await product.save({validateBeforeSave:false})
//    res.status(200).json({
//        success:true
//    })
// })

