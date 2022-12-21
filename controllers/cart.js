const User = require("../models/user");


exports.addItemToCart = async(req,res)=>{
     
   const {userid,product} = req.body;

   const _id  = product;

  

    

    User.find({
      $and:[
        {_id:userid},{cart:{$elemMatch:{product:_id}}}
      ]
    }).then((obj)=>{
      
      if(obj.length==0)
      {
        req.body.quantity = 1;
       
        User.findOneAndUpdate({_id:userid},{$push:{cart:req.body}},{new:true}).populate('cart.product')
        .then((obj)=>{
          
               return res.json(obj);
           
        }).catch((error)=>{
          
            return res.json(error);
        })
      }
      else{
       
          User.findOneAndUpdate({_id:userid,"cart.product":_id},{$inc:{"cart.$.quantity":1}},{new:true}).
          populate('cart.product').
          then((obj)=>{
             return res.json(obj);

          }).catch((error)=>{
            return res.json(error)
          })
      }
     
     
    })
    .catch((err)=>{
      res.json(err);
    })
    

}


exports.removeItemFromCart = async (req,res)=>{
      
   const {_id} = req.body;
   try{
    const result = await User.findOneAndUpdate({
       
     cart:{
        $elemMatch:{
          product:_id,
          quantity:{$gt:1}
        }
     }
   },{$inc:{"cart.$.quantity":-1}},{new:true}).populate('cart.product');
    
  

      if(result===null)
      {
         
          const temp = await User.findOneAndUpdate({"cart.product":_id},{$pull:{cart:{product:_id}}},{new:true}).populate('cart.product')
         
          return res.json(temp);
      }
      else
      {
        
        return res.json(result);
      }
  }
  catch(error){
    
        return res.json(error);
  }
}


exports.getItemFromCart = async(req,res)=>{

  
  const {_id} = req.body;

  
  try{
      const obj = await User.findById({_id:_id}).select({"cart":1,"_id":0}).populate('cart.product');
      
  

      return res.status(200).json(obj);
  }
  catch(error){
  
      return res.status(400).json(error);
  }
}


