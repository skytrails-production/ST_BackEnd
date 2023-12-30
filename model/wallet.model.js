const mongoose = require("mongoose");
const {Schema} = require("mongoose");

const wallet = mongoose.model(
  "wallet",
  new mongoose.Schema(
    {
        balance: { 
          type: Number, 
          default: 0 
        },
        userId: {
          type: Schema.Types.ObjectId,
          ref: "users",
        },
        currency: {
            type: String,
            required: [true, "currency is required"],
            enum: ["USD", "EUR","INR"],
            default:"INR"
          },
          status: {
            type: String,
            required: [true, "payment status is required"],
            enum: ["successful", "pending", "failed"],
          },
      },
      { timestamps: true }
  )
);

module.exports = wallet;
