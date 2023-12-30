const mongoose = require("mongoose");
const {Schema} = require("mongoose");
const walletTransaction = mongoose.model(
  "walletTransaction",
  new mongoose.Schema(
    {
        userId: {
          type: Schema.Types.ObjectId,
          ref: "users",
        },
        transactionId: {
          type: String,
          require:true,
          trim: true,
        },
        name: {
          type: String,
          required: [true, "name is required"],
          trim: true,
        },
        email: {
          type: String,
          required: [true, "email is required"],
          trim: true,
        },
        phone: {
          
        },
        amount: {
          type: Number,
          required: [true, "amount is required"],
        },
        currency: {
          type: String,
          required: [true, "currency is required"],
          enum: ["INR", "USD", "EUR",],
        },
        paymentStatus: {
          type: String,
          enum: ["successful", "pending", "failed"],
          default: "pending",
        },
      },
      {
        timestamps: true,
      }
  )
);

module.exports = walletTransaction;



