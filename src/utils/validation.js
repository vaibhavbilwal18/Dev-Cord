const validator = require("validator");

const validateSignUpData = (req) => {
    const {firstName , lastName , emailId , password} = req.body;
   
    if(!firstName || !lastName){
        throw new Error("Name is not valied");
    }else if(!validator.isEmail(emailId)){
        throw new Error("Email is not valied");
    }else if(!validator.isStrongPassword(password)){
        throw new Error("Password must be at least 8 characters long, include at least one uppercase letter, one lowercase letter, and one special symbol.");
    }

};

const ValidateEditProfileData = (req) => {
   const allowedEditFileds = ["firstName" , "lastName" , "age" , "gender" , "photoUrl" , "skills" , "about"];

   const isEditAllowed = Object.keys(req.body).every((field) => allowedEditFileds.includes(field)); // Basic loops in js
   return isEditAllowed;
}

module.exports = {validateSignUpData, ValidateEditProfileData};