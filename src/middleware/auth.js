const jwt = require("jsonwebtoken");
const { User } = require("../models/user"); 
const userAuth = async (req, res, next) => {
  try {
    // Read the token from cookies
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).send("Please Login First");
    }
    // Verify the token
    const decodedObj = jwt.verify(token, process.env.JWT_SECRET);
    const { _id } = decodedObj;
    // Find user by ID
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User Not Found");
    }
    // Attach user to request object
    req.user = user;
    next(); 
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
};
module.exports = { userAuth };
