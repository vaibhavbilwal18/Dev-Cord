 
 const express = require('express');

 const app = express();

 const {authadmin} = require("./middleware/auth.js");

  app.use("/admin" , authadmin);

 app.get("/admin/getData" , (req , res) => {
      res.send("All Data Sent");
 });



 app.listen(3000 ,  () => {
    console.log("Server is started successfully on 3333...");
 });
// Space also matter in url or request 
//