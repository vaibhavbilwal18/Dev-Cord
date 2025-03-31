const express = require('express');
const authRouter = express.Router();
const validator = require("validator");
const {validateSignUpData} = require('../utils/validation.js');
const bcrypt = require("bcrypt"); // And for systeam imports no required {} :
const { User }  = require("../models/user"); // All the requires or import from files in curly braces 




// SignUp Api 
authRouter.post("/signup", async(req,res) => {
    try{
     // Validation of data 
        await validateSignUpData(req);
  
     // Encrypt the password 
         const {firstName , lastName , emailId,password} = req.body;
  
         const passwordHash = await bcrypt.hash(password , 10);
     
    // above things are required for saving data in data base 
  
    const user = new User({
      firstName , lastName , emailId , password: passwordHash
      // just seen password : passwordHash remaimber first one is stored thing or base intitiy and second one coping from our own 
    });
  
    
     await user.save();
     res.send("User Added Successfully");
     }catch(err){
       res.status(400).send("Error :"  + err.message);
     }
   });

// Login Api
 authRouter.post("/login" , async(req, res) => {
   
    try{
      const {emailId , password} = req.body;
  
      if(!validator.isEmail(emailId)){
        throw new Error("Email ID is not Valied");
      }
  
      const user = await User.findOne({emailId : emailId});
  
      if(!user){
        throw new Error("Invalied Creadentials !!");
  
      }
  
      const isPassword = await user.validatePassword(password);
  
      if(isPassword){
       const token = await user.getJWT();
  
       // add the token to cookies and send the responces back to the user 
        res.cookie("token" , token , {
          expires: new Date(Date.now() + 8 * 3600000),
        });
        res.send("User Login SuccessFully !!");
      }else{
        throw new Error("Invalied Creadential !!");
      }
    }catch(err){
      res.status(404).send("Error :" + err.message );
    }
   });
    

module.exports = authRouter;