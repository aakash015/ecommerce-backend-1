const Razorpay = require('razorpay')


console.log("this"+process.env.Razorpay_API_KEY)

exports.instance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_API_SECRET,
});
