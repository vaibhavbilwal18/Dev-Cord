const express = require('express');
const app = express();
const connectDB = require("./config/database.js");
const User = require("./models/user");
const { default: mongoose } = require('mongoose');

 // Middleware to parse JSON bodies
 app.use(express.json());
 // Adding New user 
 app.post("/signup", async(req,res) => {

  
  const user = new User(req.body);

   try{
   await user.save();
   res.send("User Added Successfully");
   }catch(err){
     res.status(400).send("Error saving the user" + err.message);
   }
 });

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
          console.log("Server is started successfully on 3000...");
      });
     })
      .catch((err) => {

        console.error("Databse cannot be connect");
      });
 

