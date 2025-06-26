require('dotenv').config();
const express = require('express');
const app = express();
const connectDB = require("./config/database.js");
const {  mongoose } = require('mongoose');
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http");
const initializaSocket = require("./utils/socket.js");

 app.use(express.json());
 app.use(cookieParser());
 app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
 }));


 const authRouter  = require("./routes/auth");
 const profileRouter = require("./routes/profile");
 const requestRouter = require("./routes/request");
 const userRouther = require('./routes/user.js');
 const initializeSocket = require("./utils/socket");
 const chatRouter = require("./routes/chat");
 const paymentRouter = require("./routes/payment");

 app.use("/" , authRouter);
 app.use("/" , profileRouter);
 app.use("/" , requestRouter);
 app.use("/" , userRouther);
 app.use("/", chatRouter);
 app.use("/" , paymentRouter);


const server = http.createServer(app);
initializeSocket(server);



 connectDB()
     .then(()=> {
        console.log("Database Connected Successfully !!");
        server.listen(3000, () => {
          console.log("Server is started successfully on 3000...");
      });
     })
      .catch((err) => {
        console.error("Databse cannot be connect");
      });


