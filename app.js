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
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({extended:true}));
//this is a body parser middleware what this do is when a req comes it 
//parses the data in body of req present in json format 
//and we can easily console.log(req.body);
//if we won't use this middleware then req.body will not be parsed and hence null;
 

app.use(cookieParser());
//cookieParser is used in inserting the jwt (JSON WEB TOKEN) in user's browser;
//the token is generated with the JsonWebtoken npm package 
//and then inserted using cookie parser 
//and all the http requstes are check that they are authenticated or not 
//by express-jwt


app.use(cors());

//jaise hi /api/signup ki postcall jati h wiase hi pehle yahan ek ek krk sare middleware
//function execute hote h aur phir ye call /api wale path based middleware pe jati h 

//my routes

// app.use((req,res,next)=>{
   
//   console.log("hai hukkooo")
//   next();
// })

// app.use(()=>{
//   console.log("oo yeah")
// })


app.use("/api",authRoutes); //path associated middlewares
app.use("/api",userRoutes);
app.use('/api',categoryRoutes);
app.use('/api',productRoutes);
app.use('/api',orderRoutes);
app.use('/api',paymentRoutes);
app.use('/api',cartRoutes);
app.use('/api',addressRoutes);

//port 
const port = process.env.PORT||3100
mongoose.connect('mongodb://0.0.0.0:27017/tshirt')
//process.env.DATABASE||
//the reason to do this like process.env.DATABASE is because when we host the 
//porject all sensitive information such as the path of the databse will be uplaoded 
//so anybody can watch that and do many wrong things 
//but when we keep our variable in .env file 
//the .env file won't get uploaded on the server 
 
.then(()=>{
  console.log("connected to database")
})
.catch((error)=>{
   console.log(error)
}) //ismein hum wo path de rhe h 
//ki humara local database kahan pada h jisse connect krna h 
//agar test nam ka koi database nhi h to it will create a new one 


//heroku

if(process.env.NODE_ENV == "production")
{
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname,  "client/build", "index.html"));
  });
}

//db connection 


app.listen(port,()=>{
  console.log(`listening to port ${port}`)
})


//the process or functioning between the request and the rsponse is handled by the
//middleware

//next in middleware is basically like i have finished the current middleware
//now i am sending the control to the next middleware 
 
