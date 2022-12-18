const { instance }  = require("../razorpayInstance");
// const fs = require('fs');
const {updateStock} = require('../controllers/product')
const crypto = require("crypto");
const { Order } = require("../models/order");
        
exports.checkout = async(req,res)=>{
    
  // console.log(process.env.Razorpay_API_SECRET)
   console.log(req.body)

  try{
      const order = await instance.orders.create({
        amount: Number(req.body.amount*100),  // amount in the smallest currency unit
        currency: "INR",
      })
  
       console.log(order);

      res.status(200).json({
      success : true,
      order
     })
   }
   catch(err){
    console.log(err)
      res.status(400).json({
        error:err
      })
   }
}


exports.paymentVerification = async(req,res)=>{
        
  const {razorpay_payment_id,razorpay_order_id,razorpay_signature} = req.body;

        // console.log(req.body)

        let body=razorpay_order_id + "|" +razorpay_payment_id;

        console.log("###########")
        console.log(razorpay_order_id);
       
        let expectedSignature =  crypto.createHmac('sha256', 'RRjApiXMsGDa5Ux3L0ZPDjUV')
                                        .update(body.toString())
                                        .digest('hex');
                                        console.log("sig received " ,razorpay_signature);
                                        console.log("sig generated " ,expectedSignature);
      

                          
                 if(expectedSignature===razorpay_signature)
                 {
                    
                    try{     
                    // const finalorders = await instance.payments.fetch(razorpay_payment_id);
                    
                    // console.log("######")
                    // console.log(finalorders);
                      
                    const data = await Order.findOneAndUpdate({orderid:razorpay_order_id},{payment:true},{new:true});
                    // console.log(data)
                    const final = await updateStock(data.products);
                    
                    res.redirect(`http://localhost:3000/paymentsuccess?reference=${razorpay_order_id}`)
                    }
                    catch(err){
                       console.log(err)
                    }
                 }
                 else{
                     res.status(400).json({
                          success:false
                      })
                 }                       
         
        
}