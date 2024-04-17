const mongoose = require("mongoose");
const status = require("../enums/status");
const staticContentsType = require("../enums/staticContentType");
const subStaticContentType = require("../enums/subStaticContentType");

const mongoosePaginate = require("mongoose-paginate-v2");
mongoose.pluralize(null);
const agentStaticContentSchema = new mongoose.Schema(
  {
    agentId: {
      type: mongoose.Types.ObjectId,
      ref:'userb2bs'
    },
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    type: {
      type: String,
      enums: [
        staticContentsType.ABOUTTHESITE,
        staticContentsType.ABOUTUS,
        staticContentsType.BOOKINGPOLICY,
        staticContentsType.HOLIDAYPACKAGE,
        staticContentsType.HOTELS,
        staticContentsType.IMPORTANTLINKS,
        staticContentsType.PRIVACYPOLICY,
        staticContentsType.QUICKLINKS,
        staticContentsType.RETURNPOLICY,
        staticContentsType.TRAVELINSURENCE,
        staticContentsType.QUESTION,
        staticContentsType.CONTACTUS,
      ],
    },
    contactNumber: {
      type: String,
    },
    email: {
      type: String,
    },
    address: [
      { OperationalAddress: { type: String } ,
       RegisteredAddress: { type: String } },
    ],
    location: {
      type: {
        type: String,
        default: "Point",
      },
      coordinates: {
        type: [Number],
        default: [0, 0],
      },
    },
    status: {
      type: String,
      enum: [status.ACTIVE, status.BLOCK, status.BLOCK],
      default: status.ACTIVE,
    },
  },
  { timestamps: true }
);
agentStaticContentSchema.plugin(mongoosePaginate);
agentStaticContentSchema.index({ location: "2dsphere" });
module.exports = mongoose.model("agentStaticContent", agentStaticContentSchema);
