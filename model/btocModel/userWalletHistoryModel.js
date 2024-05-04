const { string } = require("joi");
const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const status = require("../../enums/status");
const offerType = require("../../enums/offerType");
const paymentStatus = require("../../enums/paymentStatus");
mongoose.pluralize(null);
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const mongoosePaginate = require("mongoose-paginate-v2");

const walletSchema = mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "userBtoC",
    },
    source: {
      type: String,
    },
   
        amount: {
          type: Number,
          required: true,
        },
        details: {
          type: String,
          default: "",
        },
        transactionType: {
          type: String,
          enum: ["Credit", "Debit"],
          required: true,
        },
      },
  { timestamps: true }
);

walletSchema.plugin(aggregatePaginate);

walletSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("userWalletHistory", walletSchema);
