const {Order} = require("../models/order")


exports.getOrderById = (req,res,next,id)=>{

  Order.findById(id)
  .populate("products.product","name price") //will be more clear in frontend part
  .exec((err,order)=>{

      if(err)
        return res.status(400).json({
          error : "No order found in DB"
        })

        req.order = order;
        next(); 
  })
}


exports.createOrder = (req,res)=>{
   

        Order.findOneAndUpdate(req.body.order_id,req.body,{upsert:true},(err,order)=>{

         if(err){
          
           return res.status(400).json({
             error : "failed to save order in DB"
           })
         }

         return res.json(order);
     })
}


exports.getAllOrders = (req,res) =>{
  Order.find()
  .exec((err,order)=>{

      if(err)
       return res.status(400).json({
         error: "error in get all order"
       })

       return res.json(order);
  })
}

exports.getOrderByUser = (req,res)=>{

  const {_id} = req.body;

  Order.find({user:_id},{products:1,address:1}).then((doc)=>{
      return res.status(200).json(doc);
  }).catch((error)=>{
    return res.status(400).json(error);
  })

}

exports.getOrderStatus = (req,res)=>{
       res.json(Order.schema.path("status").enumValues) //not much clear
}


exports.updateStatus = (req,res)=>{
              Order.updateOne(
                {_id : req.body.orderId},
                {$set: {status:req.body.status}},
                   (err,order)=>{
                      if(err){
                        return res.status(400).json({
                          error : "can't update the order"
                        })
                      }
                      return res.json(order)
                   }
                
              )
}
