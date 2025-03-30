const express = require('express');
const app = express();
const connectDB = require("./config/database.js");
const User = require("./models/user");
const { default: mongoose } = require('mongoose');
const {validateSignUpData} = require('./utils/validation.js');
const bcrypt = require("bcrypt");
const validator = require("validator");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");





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

    const isPassword = await bcrypt.compare(password , user.password);

    if(isPassword){

     // Create a JWT token 

     const token = await jwt.sign({_id : user._id} , "Nothing@01$");
     console.log(token);

     // add the token to cookies and send the responces back to the user 
      res.cookie("token" , token);
      

      res.send("User Login SuccessFully !!");
    }else{
      throw new Error("Invalied Creadential !!");
    }

  }catch(err){
    res.status(404).send("Error :" + err.message );
  }
 });
  
 // Profile 
 app.get("/profile" , async(req, res) => {
  const cookie = req.cookies;

  const {token} = cookie;

  
  const decodedMsg = await jwt.verify(token , "Nothing@01$");

  const {_id} = decodedMsg;
  
  const user = await User.findById(_id);
 
  res.send(user);
 })
 

 // for only one user on the emailId basis 
 app.get("/user" , async(req,res) => {
      const userEmail = req.body.emailId;

      try{
          const user = await User.find({emailId: userEmail});
          if(user.length === 0){
            res.status(404).send("User Not Found");
          }else {
          res.send(user);
        }
      }catch(err){
         res.status(400).send("Something Went Wrong");
      }
 });

 //Showing all user data
 app.get("/feed" , async(req ,res) => {
    try{
       const Users = await User.find({});
       res.send(Users);
    }catch(err){
      res.status(404).send("Data is not Found");
    }
 });

 // Update data of user using UserID 

 app.patch("/user" , async(req, res) => {
    const userId = req.body.userId;
    const data = req.body;

    try{
      const user = await User.findByIdAndUpdate({ _id: userId} , data,{
         returnDocument: "after",
         runValidators: true,
      });
        console.log(user);
        res.send("User updtaed Successfully");
    }catch(err){
      res.status(400).send("Something went wrong");
    }
   
 });

 // DELETE endpoint to remove an item by ID
 app.delete("/delete", async (req, res) => {
  const { _id } = req.body; // Getting _id from Postman request body

  // Validate input
  if (!_id) {
      return res.status(400).json({ message: "User ID is required" });
  }

  // Validate ObjectId format
  if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(400).json({ message: "Invalid User ID format" });
  }

  try {
      // Find the user
      const user = await User.findById(_id);
      
      if (!user) {
          return res.status(404).json({ message: "User Not Found" });
      }

      // Delete the user
      await User.findByIdAndDelete(_id);
      
      res.status(200).json({ 
          message: "User Profile Deleted Successfully!",
          deletedId: _id
      });

  } catch (err) {
      console.error("Delete error:", err);
      res.status(500).json({ 
          message: "Error deleting user",
          error: err.message 
      });
  }
});

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
 

