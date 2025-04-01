const express = require('express');
const app = express();
const connectDB = require("./config/database.js");
const {  mongoose } = require('mongoose');
const cookieParser = require("cookie-parser");

 app.use(express.json());
 app.use(cookieParser());

 const authRouter  = require("./routes/auth");
 const profileRouter = require("./routes/profile");
 const requestRouter = require("./routes/request");
const userRouther = require('./routes/user.js');

 app.use("/" , authRouter);
 app.use("/" , profileRouter);
 app.use("/" , requestRouter);
 app.use("/" , userRouther)

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
 

