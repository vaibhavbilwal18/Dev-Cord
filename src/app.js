const express = require('express');
const app = express();
const connectDB = require("./config/database.js");
const User = require("./models/user");

 app.use(express.json());

 app.post("/signup", async(req,res) => {

  
  const user = new User(req.body);

   try{
   await user.save();
   res.send("User Added Successfully");
   }catch(err){
     res.status(400).send("Error saving the user" + err.message);
   }
 });

 // for only one user 
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

 app.get("/feed" , async(req ,res) => {
    try{
       const Users = await User.find({});
       res.send(Users);
    }catch(err){
      res.status(404).send("Data is not Found");
    }
 })

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
 

