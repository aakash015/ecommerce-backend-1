const User = require('../models/user') 
const {validationResult} = require('express-validator')
var jwt = require('jsonwebtoken'); // token banane ke kaam mein aata h
var  expressJwt = require('express-jwt'); // jo bhi request hoti h jismein hum log
//iska use krte h wo check krti h pehle ki user authenticated h ki nhi
const nodemailer = require('nodemailer');


 exports.signout = (req,res)=>{
  
  res.clearCookie('token');
  res.json({
      message : "User signed out"
  })

}

exports.signup = (req,res)=>{
  
  //express validator binds the validation result with the req body 
  // Finds the validation errors in this request and wraps them in an object with handy functions

  const errors = validationResult(req);

    if(!errors.isEmpty())
     {
       return res.status(422).json({
         error: errors.array()[0].msg //.array() converts everything in array 
         //errors is object basically 
       })
     }
  
  const user = new User(req.body);
   
  user.save((err,user)=>{ //saving the user in databse 
     if(err){
       return res.status(400).json({
         err : "Unable to save the user"
       })
     }
      return res.json({
        name : user.name,
        email : user.email,
        id : user._id
      });
  })

}

exports.forgotpassword = async(req,res)=>{
  
   const {email} = req.body;

   try{
     const result =  await User.findOne({email:email});

     if(result==null)
     {
        return res.json({message:"Account not found"});
     }
     
     

     let {_id} = result;
     
    
      

     const token = jwt.sign({_id:_id},"unspokenwords",{expiresIn:'900000'});
     
     

     const link = `http://localhost:3000/passwordreset/${token}`
     
    

       let transporter = nodemailer.createTransport({
        service:'gmail',
        auth:{
          user:'tiwaryaakash00@gmail.com',
          pass:'kbvdrfmmjirjbuiu'
        }
     });

     let mailOptions  = {
       from:'tiwaryaakash00@gmail.com',
       to:result.email,
      //  to:result.email,
       subject:"password reset link",
       text:"Click on the following link to reset password, this link is valid for 15 minutes \n"+link
     }
    
    
    
     transporter.sendMail(mailOptions,(error,info)=>{
        if(error)
         return res.json(error)
        else
         return res.json(info) 
     })

   }
   catch(error){
       res.send(error); 
   }

}

exports.resetPassword = async(req,res)=>{

    const {pass,_id} = req.body;
    
    let user;

    try{
     user = await User.findById({_id:_id});
    
    user.password = pass;

    user.save().then(()=>{
        return res.json({"response":"1"});
    })
    .catch(()=>{
       return res.json({"response":"0"});
    })
  }
  catch(error){
      return res.json({"response":"0"})
  }
}

exports.signin = (req,res)=>{
  const  {email,password} = req.body;

  const errors = validationResult(req);

  if(!errors.isEmpty())
   {
     return res.status(422).json({
       error:errors.array()[0].msg
     })
   }

   User.findOne({email},(err,user)=>{

        if(err || !user){
          return res.status(400).json({
            error : "USER email doesn't exist"
          }) 
        }

       
       if(!user.authenticate(password))
       { 
         return res.status(401).json({
            error : "Wrong Email Passowrd Combination"
          })

       } 
    
       //creating a token
       const token = jwt.sign({_id : user._id},process.env.SECRET);
      //putting that token into cookie
       res.cookie("token",token,{expires:new Date(Date.now()+50000),httpOnly:true});

      //sending response to front-end

      const {_id,name,email,role,purchases,address} = user;

      return res.json({token,_id,name,email,role,purchases,address});
   })
}


exports.isSignedIn = expressJwt({
  secret : process.env.SECRET,
  userProperty:"auth" //decode krne ke baad iss auth mein id daal di jaati h 
  //jo apan ne token ke liye pass kri thi 
  
})

// yahan pe ye isSignedin auth token ko doondhta h authorization header mein
//aur ye secret ka use krk uske payload ko decode krta h ki kya user authorised h 
//isko view krne ke liye aur kya scene h 
//isSignedIn middleware h ek next isliye nahi likha h kyunki 
//express jwt apne aap sambhal lega 


//custom middlewares


exports.isAuthenticated = (req,res,next)=> {
  
    let checker = req.profile && req.auth && req.profile. _id == req.auth._id;
    
  
    if(!checker)
    {
       return res.status(403).json({
         error: "ACCESS DENIED"
       }); 
    }

  next();
}


exports.isAdmin = (req,res,next)=> {
  
   if(req.profile.role===0)
   {
     return res.status(403).json({
       error: "You are not admin!!"
     });
   }
  
  next();
}