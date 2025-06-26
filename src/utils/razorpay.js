const Razorpay = require('razorpay');


var instance = new Razorpay({
  key_id: process.env.Razorpay_KEY_ID, // Replace with your Razorpay key ID
  key_secret: process.env.Razorpay_KEY, // Replace with your Razorpay key 
});

module.exports = instance;