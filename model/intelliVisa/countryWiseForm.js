const { Timestamp } = require("@google-cloud/firestore");
const mongoose = require("mongoose");

const countryWiseVisaFormSchema = new mongoose.Schema(
  {
    country: { type: String },
    common: {
      visitPurpose: String,
      isAdult: Boolean,
      travelAlone: Boolean,
    },

    formData: {
      type: Schema.Types.Mixed
    },
  },
  { Timestamp: true, minimize: false }
);
const countryWiseModel = mongoose.model(
  "CountryVisaForm",
  countryWiseVisaFormSchema
);
module.exports = countryWiseModel;
