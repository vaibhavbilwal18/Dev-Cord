
const express = require('express');
const { userAuth } = require('../middleware/auth');
const ConnectionRequestModel = require('../models/connectionRequest');
const {User} = require('../models/user')

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

userRouther.get("/user/requests/connection" , userAuth , async(req,res)=> {
    try{
    const loggedInUser = req.user;

    const connectionRequest = await ConnectionRequestModel.find({
        $or: [
            {toUserId: loggedInUser._id , status: "accepted"},
            {fromUserId: loggedInUser._id , status: "accepted"},

    ]
    }).populate("fromUserId" , SAFE_DATA)
      .populate("toUserId" , SAFE_DATA);

    const data = connectionRequest.map((row) => { 
        if(row.fromUserId._id.toString() === loggedInUser._id.toString()){
            return row.toUserId;
        }
        return row.fromUserId 
    });
    res.json({data});
    }catch(err){
        res.status(400),send("Error " + err.message);
    }
})

userRouther.get("/feed" , userAuth , async(req,res) => {
    try{
        const loggedInUser = req.user;
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 50 : limit;
        const skip = (page -1)*limit;

        const connectionRequest =  await ConnectionRequestModel.find({
            $or:[
                {fromUserId: loggedInUser._id},
                {toUserId: loggedInUser._id}
            ]
        }).select("fromUserId toUserId");

        const hideUserFromFeed = new Set();
        connectionRequest.forEach(req => {
            hideUserFromFeed.add(req.fromUserId);
            hideUserFromFeed.add(req.toUserId);
        });


        const users = await User.find({
            $and: [
            {_id: {$nin : Array.from(hideUserFromFeed)}},
            {_id: {$ne: loggedInUser._id}},
         ],
        }).select(SAFE_DATA).skip(skip).limit(limit);
    res.send(users);
    }catch(err){
        res.status(400).json({message: err.message});
    }
});

module.exports = userRouther;