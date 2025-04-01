const express = require('express');
const bcrypt = require("bcrypt");

const profileRouter = express.Router();
const { userAuth } = require('../middleware/auth.js');
const { ValidateEditProfileData } = require("../utils/validation");

// View Profile
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

// Edit Profile
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!ValidateEditProfileData(req)) {
      throw new Error("Invalid Edit Request");
    }

    const loggedInUser = req.user;

    Object.keys(req.body).forEach((key) => {
      if (req.body[key] !== undefined) {
        loggedInUser[key] = req.body[key];
      }
    });

    await loggedInUser.save();

    res.send(`${loggedInUser.firstName} Profile Updated successfully`);
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

// Edit Password
profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      throw new Error("Invalid Request");
    }
    const { oldPassword, newPassword } = req.body;
    // Validate input
    if (!oldPassword || !newPassword) {
      throw new Error("Both old and new passwords are required");
    }
    // Check if old password is correct
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      throw new Error("Old password is incorrect");
    }
    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    // Save updated password
    await user.save();
    res.send("Password updated successfully!");
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

module.exports = profileRouter;
