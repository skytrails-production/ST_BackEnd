const mongoose = require("mongoose");
const status = require("../../enums/status");
const mongoosePaginate = require("mongoose-paginate-v2");
const issuedType = require("../../enums/issuedType");
const visaType = require("../../enums/visaType");
const genderType = require("../../enums/gender");
mongoose.pluralize(null);
const visaSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
    },
    constactNumber: {
      type: String,
    },
    gender: {
      type: String,
      enum: [genderType.FEMALE, genderType.MALE, genderType.OTHER],
    },
    dob: {
      type: String,
    },
    visatype: {
      type: String
    },
    document:{
        type: String
    },
    status: {
      type: String,
      default: status.ACTIVE,
    },
  },
  { timestamps: true }
);
visaSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("visa", visaSchema);
