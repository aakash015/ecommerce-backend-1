const User = require("../models/user");

exports.addAddress = async(req,res)=>{
     
   const{_id,address} = req.body;

  try{ 
   const result = await User.findByIdAndUpdate({_id:_id},{
      $push:{
        address:{
          $each:[address],
          $position:0
        }
      }
   },{new:true})

    return res.json(result);
  }
  catch(error){
    return res.json(error);
  }

}