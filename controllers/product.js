const Product = require('../models/product');
const formidable = require('formidable');//form data handle krne ke liye 
const _  = require('lodash'); //javascript ke kaam ko bohot aasan kr deta hai 
const fs = require('fs');


exports.getProductById = (req,res,next,id)=>{
   
   Product.findById(id)
   .populate('category')
   .exec((err,product)=>{

       if(err)
       return res.status(400).json({
            
        error : "Product No found"
       })
      
        req.product = product;
        next();
   })
}

exports.createProduct = (req,res)=>
{
   let form = new formidable.IncomingForm();
   
   form.keepExtensions = true; //this is basically for keeping extensions
   //of uploaded files such as jpeg or png

   form.parse(req,(err,fields,file)=>{

           if(err)
           {
              return res.status(400).json({
                 error : "Some error occured in file"
              })
           }

           //destructuing the fields

           const {name,description,price,category,stock} = fields;

           if(
              !name ||
              !description ||
              !price ||
              !category ||
              !stock   
           ){
                 return res.status(400).json({
                    error : "Please include all fields"
                 })
           }

           let product = new Product(fields);

           //handling the file here

           if(file.photo){
              if(file.photo.size>3000000){
                 return res.status(400).json({
                    error : "File size too big"
                 })
              }

              product.photo.data = fs.readFileSync(file.photo.path);
              product.photo.contentType = file.photo.type;
           }

           //saving to the database

           product.save((err,product)=>{
                 if(err)
                 res.status(400).json({
                    error : "Saving Tshirt in DB failed"
                 })

                 res.json(product);
                 
           })
   })
   
}

exports.getProduct = (req,res)=>{
   //hitesh ne 10th module ki 7th video mein ise optimise kra h 
   //abhi yahan maine nhi kiya hai kyunki thodi mushkl hai 
   return res.json(req.product)
}

exports.photo = (req,res,next)=>{
   if(req.product.photo.data){
      res.send(req.product.photo.data);
   }

   next();
}

exports.deleteProduct = (req,res)=>{
 
   let product = req.product;
   
     
   product.remove((err,deletedProduct)=>{
      if(err)
      return res.status(400).json({
         error : "Failed to delete the product"
      })

      res.json({
         message : "deletion successfull"
      })
   })
}

exports.updateProduct = (req,res)=>
{
   
   let form = new formidable.IncomingForm();
   
   form.keepExtensions = true; //this is basically for keeping extensions
   //of uploaded files such as jpeg or png

   form.parse(req,(err,fields,file)=>{

           if(err)
           {
              return res.status(400).json({
                 error : "Some error occured in file"
              })
           }

        
          

           let product = req.product
           
           product = Object.assign(product,fields);
           //handling the file here

           if(file.photo){
              if(file.photo.size>3000000){
                 return res.status(400).json({
                    error : "File size too big"
                 })
              }

              product.photo.data = fs.readFileSync(file.photo.path);
              product.photo.contentType = file.photo.type;
           }

           //saving to the database

           product.save((err,product)=>{
                if(err)
                 res.status(400).json({
                    error : "Saving Tshirt in DB failed"
                 })

                 res.json(product);
                 
           })
   })
   
}

exports.getAllProducts = (req,res)=>{

   // let no_of_products = req.query.limit? parseInt(req.query.limit):8;
   // let sortBy = req.query.sortBy?req.query.sortBy : "price"

   
   Product.find()
   .populate(
   {path:"catgeory",strictPopulate:false})
   .select("-photo")
   .exec((err,products)=>{

      if(err){
        return res.status(400).json({
           error : "some error occured"
        })
      }
      
       return res.json(products);

   })
}

exports.updateStock = async (products)=>{
   
    let myOperations = products.map(prod =>{
       return {
          updateOne: {
             filter : {_id : prod._id},
             update : {$inc: {stock : -parseInt(prod.quantity),sold: +parseInt(prod.quantity)}}
          }
       }
    })

    Product.bulkWrite(myOperations,{},(err,products)=>{
        
     
         if(err)
         {
            console.log(err)
         }
         else{
            console.log("success")
         }
    }) 

    return;
}

exports.getAllUniqueCategories = (req,res,next)=>{

     Product.distinct("category",{},(err,category)=>{
         if(err)
         {
           return res.status(400).json({
              error : "No category found"
           })
         }
          
         return res.json(category);
     })
}