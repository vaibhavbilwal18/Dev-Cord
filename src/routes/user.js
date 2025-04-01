
const express = require('express');
const { userAuth } = require('../middleware/auth');
const ConnectionRequestModel = require('../models/connectionRequest');

const userRouther = express.Router();
const SAFE_DATA = "firstName lastName age gender about";

userRouther.get("/user/requests/received" , userAuth , async(req ,res) => {
     try{
        const loggedInUser = req.user;
        const connectionRequest = await ConnectionRequestModel.find({
            toUserId: loggedInUser._id,
            status: "interested",

        }).populate("fromUserId" , ["firstName" , "lastName" , "photoUrl" , "age" , "about"]);

        res.json({
            message: "Data fetched successfully",
            data: connectionRequest,
        });


     }catch(err){
        res.status(400).send("Error " + err.message)
     }
});

userRouther.get("/user/connections" , userAuth , async(req,res)=> {
    try{
    const loggedInUser = req.user;

    const connectionRequest = await ConnectionRequestModel.find({
        $or: [
            {toUserId: loggedInUser._id , status: "accepted"},
            {fromUserId: loggedInUser._id , status: "accepted"},

    ]
    }).populate("fromUserId" , SAFE_DATA);

    const data = connectionRequest.map((row) => row.fromUserId);
    res.json({data});
    }catch(err){
        res.status(400),send("Error " + err.message);
    }
})
module.exports = userRouther;