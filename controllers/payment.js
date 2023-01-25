const { instance }  = require("../razorpayInstance");
// const fs = require('fs');
const {updateStock} = require('../controllers/product')
const crypto = require("crypto");
const { Order } = require("../models/order");
        
exports.checkout = async(req,res)=>{
    

  try{
      const order = await instance.orders.create({
        amount: Number(req.body.amount*100),  // amount in the smallest currency unit
        currency: "INR",
      })
  

      res.status(200).json({
      success : true,
      order
     })
   }
   catch(err){
  
      res.status(400).json({
        error:err
      })
   }
}


exports.paymentVerification = async(req,res)=>{
        
  const {razorpay_payment_id,razorpay_order_id,razorpay_signature} = req.body;

        let body=razorpay_order_id + "|" +razorpay_payment_id;
     
        let expectedSignature =  crypto.createHmac('sha256', 'RRjApiXMsGDa5Ux3L0ZPDjUV')
                                        .update(body.toString())
                                        .digest('hex');
      

                          
                 if(expectedSignature===razorpay_signature)
                 {
                    
                    try{     
                      
                    const data = await Order.findOneAndUpdate({orderid:razorpay_order_id},{payment:true},{new:true});
                    const final = await updateStock(data.products);
                    
                    // console.log("hery fji")
                    res.redirect(`https://ecommerce-frontend-1.vercel.app/paymentsuccess?reference=${razorpay_order_id}`)
                    }
                    catch(err){
                    }
                 }
                 else{
                     res.status(400).json({
                          success:false
                      })
                 }                       
         
        
}