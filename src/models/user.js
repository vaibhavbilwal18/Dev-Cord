const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      index : true,
    },
    lastName: {
      type: String,
      index: true,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid Email Address: " + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        // Check password length
        // if (value.length < 8 || value.length > 15) {
        //   throw new Error("Password must be between 8 and 15 characters");
        // }
        
        // Keep the strong password validation
        if (!validator.isStrongPassword(value)) {
          throw new Error("Password must contain at least one uppercase letter, one lowercase letter, one number and one special character");
        }
      },
    },
    age: {
      type: Number,
      min: 18,
      max: 90,
      validate(value) {
        if (value < 18) {
          throw new Error("Age must be 18 or above: " + value);
        }
      },
    },
    gender: {
      type: String,
      enum: {
        values: ["Male", "Female", "other"],
        message: `{VALUE} is not a valid gender type`,
      },
    },
    photoUrl: {
      type: String,
      validate(value) {
        if (value && !validator.isURL(value)) {
          throw new Error("Invalid Photo URL: " + value);
        }
      },
    },
    about: {
      type: String,
      default: "This is the default description about user",
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);


// Method to generate JWT token
userSchema.methods.getJWT = function () {
  return jwt.sign({ _id: this._id }, "Nothing@01$", { expiresIn: "7d" });
};

// Method to validate password
userSchema.methods.validatePassword = async function (passwordInputByUser) {
  return await bcrypt.compare(passwordInputByUser, this.password);
};


const User = mongoose.model("User", userSchema);
module.exports = { User };
