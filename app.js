const mongoose = require('mongoose');
const express = require("express")
const path = require('path');
require("dotenv").config();
const app = express();
//my routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const categoryRoutes = require('./routes/category');
const productRoutes = require('./routes/product');
const orderRoutes = require('./routes/order');
const paymentRoutes = require('./routes/payment')
const cartRoutes = require('./routes/cart');
const addressRoutes = require('./routes/address');
//npm packages
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
//middlewares
// app.use(bodyParser.text({type:"*/*"}));
app.use(express.json({limit:'50mb'}));
app.use(express.text({limit:'50mb'}));
app.use(express.urlencoded({extended:true}));
 

app.use(cookieParser());


app.use(cors());



app.use("/api",authRoutes); 
app.use("/api",userRoutes);
app.use('/api',categoryRoutes);
app.use('/api',productRoutes);
app.use('/api',orderRoutes);
app.use('/api',paymentRoutes);
app.use('/api',cartRoutes);
app.use('/api',addressRoutes);


const port = process.env.PORT||3100
mongoose.connect("mongodb://0.0.0.0:27017/tshirt")
 //"mongodb://0.0.0.0:27017/"
 //process.env.DATABASE
.then(()=>{
  console.log("connected to database")
})
.catch((error)=>{
    console.log("error hi error")
   console.log(error)
})

if(process.env.NODE_ENV == "production")
{
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname,  "client/build", "index.html"));
  });
}


app.listen(port,()=>{
  console.log(`listening to port ${port}`)
})

