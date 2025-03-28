 
 const express = require('express');

 const app = express();

//  const {authadmin} = require("./middleware/auth.js");

//   app.use("/admin" , authadmin);

 app.get("/admin/getData" , (req , res) => {
      
  try{

    throw new Error("sdfgh");
    res.send("Use User data")
  }catch(err){
    res.status(500).send("Something Went Wrong try and catch block");
  }
      
      
 });

  app.use("/"  , (err , req , res, next) => {
      res.status(500).send("Something went wrong");
  },);




 app.listen(3000 ,  () => {
    console.log("Server is started successfully on 3333...");
 });
// Space also matter in url or request 
//