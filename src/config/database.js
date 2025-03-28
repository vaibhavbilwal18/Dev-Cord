const mongoose = require("mongoose");

const connectDB = async () => {
        await mongoose.connect("mongodb+srv://vaibhavbilwal2892:jshWmdh9igRV1cdP@nothing.wsjwb.mongodb.net/Dev-Cord");
    };

    module.exports = connectDB;
    

