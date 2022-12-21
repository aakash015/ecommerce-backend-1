
const Category = require('../models/category')

exports.getCategoryById = (req,res,next,categoryId)=>{

  Category.findById(categoryId).exec((err,cate)=>{

    if(err)
    return res.status(400).json({
      error : "Category Not found in the database"
    })
    
    req.category = cate;
    next();
  })
}


exports.createCategory = (req,res)=>{

    const category = new Category(req.body);
//here we are creating a category from the model that's why we have used the smaller one 

    category.save((err,category)=>{
        if(err)
        return res.status(400).json({
          error:err
        })
       
        return res.json({category});
    })
}


exports.getCategory = (req,res)=>
{ 
   return res.json(req.category);
}

exports.getAllCategory = (req,res)=>
{
   Category.find().exec((err,categories)=>{
        if(err)
         return res.status(400).json({
           error : "No categories Found"
         })

         return res.json(categories);
   })
}

exports.updateCategory = (req,res)=>
{
  
   const category = req.category;
   
   category.name = req.body.name;

   category.save((err,updatedCategory)=>{
       if(err)
       {
          return res.status(400).json({
            error : "Failed to update category"
          })
       }
       return res.json(updatedCategory);
   })
}

exports.removeCategory = (req,res)=>{
    const category = req.category;

    
    category.remove((err,category)=>{
         
      if(err)
      return res.status(400).json({
        error : "Failed to delete category"
      })
     
      return res.json({
        message : "successfully deleted"
      });

    })
   
}