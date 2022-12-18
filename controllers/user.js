const User = require("../models/user");
const Order = require('../models/order');

exports.getUserById = (req,res,next,id)=>{
   User.findById(id).exec((err,user)=>{
       //mongodb mein query execute krne ke liye ye use hota h
       //ya to ye use kro ya iski jagah callback ka use kro ek hi baat h 
       //findById(id,exec((err,user)=>{})) ye bhi theek h 
      if(err || !user){
         return res.status(400).json({
           error : "No user was found in database"
         })
      }
      
      // console.log("here")
       req.profile = user;
       next();
   })
} 

exports.getUser = (req,res)=>{
  //TODO get back here for password

  //isse ye properties hidden ho jaayengi user object mein
   req.profile.salt = undefined; 
   req.profile.encry_password = undefined;
   req.profile.updatedAt = undefined;
   

   return res.json(req.profile)
}

// exports.getallusers = (req,res)=>{
//    User.find().exec((err,user)=>{ assignment part 
//       if(err || !user)
//       return res.json({error : "No user found"})

//       return res.json({...user})
//    })
// }

exports.updateUser = (req,res)=>{
   User.findByIdAndUpdate(
      {_id : req.profile._id},
      {$set : req.body},
      {new : true}, //this new true return updated object is we don't set 
      //it to true then old object will be returned after updation
      (err,user)=>{
         if(err)
           return res.status(400).json({
              error : "you are not authorized"
           })

            user.salt = undefined; 
            user.encry_password = undefined;
           res.json({user})
      }
   )
}

exports.userPurchaseList = (req,res)=>{

   Order.find({user : req.profile._id})
   .populate("user","_id name")
   .exec((err,order)=>{
       if(err)
        return res.status(400).json({
           error : "No order found"
        })

        return res.json(order);
   })
   
}

exports.pushOrderInPurchaseList = (req,res,next)=>{
        
   //not much clear as of now

   let purchases = [];

   req.body.products.forEach(product => {

      console.log("here comes i");
      console.log(product);
      purchases.push({
         _id : product._id,
         name : product.name,
         description : product.description,
         category : product.category,
         quantity : product.quantity,
         amount : req.body.order.amount,
         transaction_id : req.body.order.transaction_id

      })
   }); //from the frontend

    //storing the purchases in the database

    User.findOneAndUpdate(
       {_id : req.profile._id},
       {$push : {purchases: purchases}},
       {new : true}
    ).exec(
       (err,purchases)=>{
           if(err)
            return res.status(400).json({
                error : "Unable to save purchase list"
            })

            next();
       }
    )
 
}