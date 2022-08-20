const Category = require('../models/category')
const Product = require('../models/product')
const errorBlock = require('../utils/errorBlock')
const cloudinary = require('cloudinary')


exports.addCategory = async (req,res,next)=>{
    if(!req.body.name){
        return errorBlock(res,401,'Category name is required.')
    }
    if(!req.body.subCategories){
        return errorBlock(res,401,'Sub category name is required.')
    }
    const category = await Category.create(req.body)

    res.status(200).json({
        success:true,
        category
    })

}
exports.getAllCategory = async (req,res,next)=>{
   
    const category = await Category.find()
    if(!category){
        return errorBlock(res,404,'No category found.')
    }
    res.status(200).json({
        success:true,
        category
    })

}

exports.deleteSubCategories = async(req,res,next)=>{
    let subcat = req.body.subCategories
    
    let categoryId = req.body.categoryId
    if(subcat.length === 0){
        return errorBlock(res,401,'Sub Categories are required.')
    }
   
    if(!categoryId ){
        return errorBlock(res,401,'Category Id is required.')
    }

    let category = await Category.findById(categoryId)
    if(!category){
        return errorBlock(res,404,'No category found with this id.')
    }else{
        category.subCategories = category.subCategories.filter((val)=>!subcat.includes(val.name))
       
        category.save().then((results)=>{
            return res.status(200).json({
                success:true,
                message:"Deleted Successfully."
            })
        })
        .catch((err)=>{
            return errorBlock(res,401,'Unable to delete.')
        })
    }

    
    



}



exports.deleteCategory =  async(req,res,next)=>{
    let categoryId = req.params.id
    let cat = await Category.findById(categoryId)
    if(!cat){
        return errorBlock(res,404,'Category not found.')
    }
    let product = await Product.find({category:cat.name})
    // console.log("PRODUCTS>>",product)
   Category.findByIdAndDelete(categoryId)
   .then((result)=>
   {
    // product.map(async(prod)=>{
    //     if(prod.images.length>0){

    //         for (let index = 0; index < prod.images.length; index++) {
    //             await cloudinary.v2.uploader.destroy(product.images[index].id)
                
    //         }
    //     }
    //     await prod.remove()
    // })

    return res.status(200).json({
        success:true,
        message:"Deleted Successfully."
    })
   }
   )
   .catch((e)=>{
    return errorBlock(res,401,'Unable to delete.')
   })


}


exports.updateCategory=async(req,res,next)=>{
    let catId = req.params.id
    let data = req.body
    if(!data.name){
        return errorBlock(res,401,'Category name is required.')
    }

    let result = await Category.findByIdAndUpdate(catId,data)
    if(!result){
        return errorBlock(res,401,'Unable to update.')
    }

    res.status(200).json({
        success:true,
        message:"Updated successfully."
    })

}


exports.updateSubCategory=async(req,res,next)=>{
    let catId = req.params.catId
    let data = req.body
    if(!data.name){
        return errorBlock(res,401,'Sub-Category name is required.')
    }

    let result = await Category.findById(catId)
    if(!result){
        return errorBlock(res,404,'Category not found.')
    }
    let allSubCats = result.subCategories
    
    
    let updatedValues = allSubCats.map((val)=>{
        console.log(val._id.toString())
        if(val._id.toString() === data.subcatId.toString()){
            
            val["name"] = data.name
        }
        return val
    })

    console.log(updatedValues)

    Category.findByIdAndUpdate(catId,{
        subCategories:updatedValues
    }).then(()=>{
        
    return res.status(200).json({
        success:true,
        message:"Updated successfully.",
        
    })
    })
    .catch((err)=>
    {return errorBlock(res,401,"Unable to update")}
    )


}