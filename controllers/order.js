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
    //  req.body.order.user = req.profile;
     
    console.log("order is called here");

    //  const order = new Order(req.body);
        
    console.log("this is request controller")
    
    console.log(req.body.order_id);

        Order.findOneAndUpdate(req.body.order_id,req.body,{upsert:true},(err,order)=>{

         if(err){
           console.log(err);
           return res.status(400).json({
             error : "failed to save order in DB"
           })
         }

         return res.json(order);
     })
}


exports.getAllOrders = (req,res) =>{
  Order.find()
  .populate("user","_id name")
  .exec((err,order)=>{

      if(err)
       return res.status(400).json({
         error: "error in get all order"
       })

       return res.json(order);
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
