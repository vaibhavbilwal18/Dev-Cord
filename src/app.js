const express = require('express');
const app = express();
const connectDB = require("./config/database.js");
const {User , userSchema } = require("./models/user");
const { default: mongoose } = require('mongoose');
const {validateSignUpData} = require('./utils/validation.js');
const bcrypt = require("bcrypt");
const validator = require("validator");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require('./middleware/auth.js');





 // Middleware to parse JSON bodies
 app.use(express.json());
 app.use(cookieParser());
 // Adding New user 
 app.post("/signup", async(req,res) => {
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
 app.post("/login" , async(req, res) => {
   
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
  
 // Profile 
 app.get("/profile" , userAuth,async(req, res) => {
  try{
  const user = req.user;
  res.send(user);
  }catch(err){
    res.status(400).send("Something went wrong");
  }
 })
 
// Connection request Api to new user
app.post("/sendconnectionrequest" , userAuth,async(req, res) => {
 
  const user = await req.user;
  console.log("Sending connection request");

  res.send(user.firstName + "  send the connection request!!");

})

 connectDB()
     .then(()=> {
        console.log("Database Connected Successfully !!");
        app.listen(3000, () => {
          console.log("Server is started successfully on 7000...");
      });
     })
      .catch((err) => {

        console.error("Databse cannot be connect");
      });
 

