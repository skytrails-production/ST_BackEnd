const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const status = require("../../enums/status");
const searchType = require("../../enums/offerType");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const mongoosePaginate = require("mongoose-paginate-v2");
mongoose.pluralize(null);
const promotionalSchema = new mongoose.Schema(
  {
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "userBtoC",
      },
    email: {
      type: String,
    },
    status: {
      type: String,
      enum: [status.ACTIVE, status.BLOCK, status.DELETE],
      default: status.ACTIVE,
    }
  },
  { timestamps: true }
);
promotionalSchema.plugin(mongoosePaginate);

promotionalSchema.plugin(aggregatePaginate);

const promotionalEmail = mongoose.model("promotionalEmails", promotionalSchema);
module.exports = promotionalEmail;
