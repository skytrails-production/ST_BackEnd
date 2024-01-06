const mongoose = require("mongoose");
const status = require("../../enums/status");
const mongoosePaginate = require("mongoose-paginate-v2");
const issuedType = require("../../enums/issuedType");
const visaType=require("../../enums/visaType")
mongoose.pluralize(null);

const visaCategorySchema = new mongoose.Schema(
  {

    visaType: {
      type:String,
      enum:[visaType.Tourist,visaType.Student,visaType.PR,visaType.Employment,visaType.Crewmember,visaType.Companion,visaType.Business]
    },
    categoryName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
  
  },
  { timestamps: true }
);
visaCategorySchema.plugin(mongoosePaginate)
module.exports = mongoose.model("VisaCategory", visaCategorySchema);
