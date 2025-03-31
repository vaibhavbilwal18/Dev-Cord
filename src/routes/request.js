const express = require('express');
const requestRouter = express.Router();
const { userAuth } = require('../middleware/auth.js');


requestRouter.post("/sendconnectionrequest" , userAuth,async(req, res) => {
 
    const user = await req.user;
    console.log("Sending connection request");
  
    res.send(user.firstName + "  send the connection request!!");
  
  });

module.exports = requestRouter;
