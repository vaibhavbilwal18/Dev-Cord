const express = require("express");
const paymentRouter = express.Router();

const { userAuth } = require("../middleware/auth");
const  Payment  = require("../models/payment");
const razorpayInstance = require("../utils/razorpay");
const { memberShipAmount } = require("../utils/constants");


paymentRouter.post("/payment/create", userAuth, async (req, res) => {


  try {
    const {memberShipType} = req.body;
    const { firstName, lastName  , emailId} = req.user;



    const order = await razorpayInstance.orders.create({
      amount: memberShipAmount[memberShipType] * 100, // Amount in paise
      currency: "INR",
      receipt: "receipt#1",
      notes: {
         firstName,
         lastName,
         emailId,
        memberShipType: memberShipType, 
      },
    });

    //save the order in database
    console.log(order);

    const payment = new Payment({
      userId: req.user._id,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      status: order.status,
      notes: order.notes,
      receipt: order.receipt,
    });

    const savedPayment = await payment.save();
  // Return the order details
    res.json({ ...savedPayment.toJSON() , keyId :process.env.Razorpay_KEY_ID , orderId: order.id,  });
  } catch (err) {
    console.error("Error in payment/create:", err);
    res.status(500).json({ error: "Payment creation failed", details: err.message });
  }
});

module.exports = paymentRouter;