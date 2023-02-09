var mongoose  = require('mongoose')
const crypto  = require('crypto')
const uuidv1 = require('uuid/v1')
const { ProductCartSchema } = require('./order')


var userSchema  = new mongoose.Schema({

  name :{
    type : String,
    required:true,
    maxlength : 32,
    minlength:3,
    trim: true
  },
  lastname : {
    type: String,
    maxlength : 32,
    trim:true
  },

  email : {
    type:String,
    trim:true,
    required:true,
    unique : true
  },

  encry_password : {
    type:String,
    required : true
  },
  salt:String,
  role : {
    type:Number,
    default:0
  },
  cart:[ProductCartSchema],
  address:{
    type:Array,
    default:[]
  },
  purchases : {
    type:Array,
    default : []
  }
},{timestamps:true}) //this timestamps create two more key value pair 
//createdAt and UpdatedAt which store the creation time of the document



userSchema.virtual("password")
.set(function(password){
 
   this._password = password //doubt here 

  this.salt = uuidv1();
  this.encry_password = this.securePassword(password)
})
.get(function(){
  return this._password;
})

userSchema.methods = {

  authenticate : function(plainPassword){
     
      return this.securePassword(plainPassword)===this.encry_password;
     
  },
  securePassword : function(plainPassword){
         
    if(!plainPassword)
     return ""

     try {
       return  crypto.createHmac('sha256', this.salt)
       .update(plainPassword)
       .digest('hex');
     } catch (error) {
        return "";
     }
  }
}

// password = "Aakash";


// console.log(userSchema.virtuals)

module.exports = mongoose.model('User',userSchema) //this User is a collection in simple
//terms and basically it is like a class from which we can create many instances  