const express = require('express');
const {signout,signup,signin, isSignedIn, forgotpassword, resetPassword} = require('../controllers/auth')
const router = express.Router();//this creates a router object 
//which again has some properties like 
const { check } = require('express-validator');



router.get('/signout',signout)


router.post('/signin',
[
   check('email',"email is not valid").isEmail(),
   check('password',"Please enter password of more than 2 chars").isLength({min:3})
],
signin)



router.post('/signup',
[
   check('name',"length must be atleast 3 characters").isLength({min:3}),
   check('email',"email is not valid").isEmail(),
   check('password',"should be atleast 3 characters").isLength({min:3})

],
signup)

router.post('/forgotpassword',forgotpassword)

router.get('/test',isSignedIn,(req,res)=>{
   res.send("protected route");
})

router.post('/resetpassword',resetPassword)

module.exports = router;