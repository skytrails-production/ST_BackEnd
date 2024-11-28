const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const status = require("../../enums/status");
const searchType = require("../../enums/offerType");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const mongoosePaginate = require("mongoose-paginate-v2");
mongoose.pluralize(null);

const promoEmailSchema=new mongoose.Schema(
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
          },
          isEmailVerified:{type:Boolean}
        },
        { timestamps: true }
);
promoEmailSchema.plugin(mongoosePaginate);

promoEmailSchema.plugin(aggregatePaginate);
const promoModel=mongoose.model("promotionalEmails", promoEmailSchema)
module.exports =promoModel